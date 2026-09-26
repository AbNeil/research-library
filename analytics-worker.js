const SITE = 'https://abneil.github.io';
const JSON_HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
function reply(data,status=200,origin=''){
  const headers={...JSON_HEADERS};
  if(origin===SITE){headers['access-control-allow-origin']=SITE;headers['vary']='Origin';headers['access-control-allow-headers']='Content-Type, Authorization';headers['access-control-allow-methods']='POST, GET, OPTIONS'}
  return new Response(JSON.stringify(data),{status,headers});
}
function validText(x,max){return typeof x==='string'&&x.length>0&&x.length<=max}
async function digest(value){const bytes=new TextEncoder().encode(value);return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('')}
export default {async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const url=new URL(request.url);
  if(request.method==='OPTIONS')return origin===SITE?new Response(null,{status:204,headers:{'access-control-allow-origin':SITE,'access-control-allow-methods':'POST, GET, OPTIONS','access-control-allow-headers':'Content-Type, Authorization','vary':'Origin'}}):reply({error:'Origin not allowed'},403);
  if(url.pathname==='/health')return reply({ready:!!env.DB},200,origin);
  if(url.pathname==='/event'&&request.method==='POST'){
    if(origin!==SITE)return reply({error:'Origin not allowed'},403,origin);
    if(Number(request.headers.get('content-length')||0)>4096)return reply({error:'Payload too large'},413,origin);
    let e;try{e=await request.json()}catch{return reply({error:'Invalid JSON'},400,origin)}
    const day=new Date().toISOString().slice(0,10);
    if(e.kind==='visit'){
      if(!validText(e.visitor,64)||!/^[0-9a-f-]{36}$/i.test(e.visitor))return reply({error:'Invalid visitor'},400,origin);
      const hash=await digest(day+':'+e.visitor+':'+env.HASH_SALT);
      const inserted=await env.DB.prepare('INSERT OR IGNORE INTO visitor_days(day,visitor_hash) VALUES (?,?)').bind(day,hash).run();
      await env.DB.prepare('INSERT INTO visits(day,pageviews,visitors) VALUES (?,1,?) ON CONFLICT(day) DO UPDATE SET pageviews=pageviews+1,visitors=visitors+excluded.visitors').bind(day,inserted.meta.changes?1:0).run();
      return reply({ok:true},200,origin)
    }
    if(e.kind!=='click'||!['publisher_click','open_fulltext_click','pdf_click','request_click'].includes(e.action)||!validText(e.title,300)||!validText(e.paper_key,150)||!validText(e.cluster,100)||typeof e.doi!=='string'||e.doi.length>150)return reply({error:'Invalid event'},400,origin);
    await env.DB.prepare('INSERT INTO events(day,paper_key,title,doi,cluster,action,count) VALUES (?,?,?,?,?,?,1) ON CONFLICT(day,paper_key,action) DO UPDATE SET count=count+1').bind(day,e.paper_key,e.title,e.doi,e.cluster,e.action).run();
    return reply({ok:true},200,origin)
  }
  if(url.pathname==='/summary'&&request.method==='GET'){
    if(!env.DASHBOARD_TOKEN||request.headers.get('Authorization')!==`Bearer ${env.DASHBOARD_TOKEN}`)return reply({error:'Unauthorized'},401,origin);
    const days=Math.min(365,Math.max(7,Number(url.searchParams.get('days'))||30));
    const from=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
    const [visits,events]=await Promise.all([
      env.DB.prepare('SELECT day,pageviews,visitors FROM visits WHERE day>=? ORDER BY day').bind(from).all(),
      env.DB.prepare('SELECT paper_key,title,doi,cluster,action,SUM(count) AS count FROM events WHERE day>=? GROUP BY paper_key,action ORDER BY count DESC LIMIT 500').bind(from).all()
    ]);
    return reply({days,visits:visits.results,events:events.results,definitions:{visitors:'Approximate distinct consenting browsers per UTC day',pdf_click:'Clicks on links labelled PDF; completed downloads cannot be verified'}},200,origin)
  }
  return reply({error:'Not found'},404,origin)
},async scheduled(_event,env){await env.DB.prepare("DELETE FROM visitor_days WHERE day < date('now','-32 days')").run()}};
