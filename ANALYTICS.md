# Research Library analytics backend

The GitHub Pages site cannot store shared counters. This Cloudflare Worker with D1 stores daily aggregate visits and outbound link clicks; `analytics.html` reads summaries through a private token. **No publisher download is observed or verified.** A click on a PDF link is counted as a click, even if the user closes the destination page or a download fails.

## Deploy with a Cloudflare account

1. Install the official Wrangler CLI and authenticate: `npx wrangler login`.
2. From the repository root, create a database: `npx wrangler d1 create research-library-analytics`. Replace `REPLACE_WITH_D1_DATABASE_ID` in `analytics-wrangler.jsonc` with the returned ID.
3. Apply the schema: `npx wrangler d1 execute research-library-analytics --remote --file=analytics-schema.sql --config analytics-wrangler.jsonc`.
4. Create distinct, long random secrets with `npx wrangler secret put HASH_SALT --config analytics-wrangler.jsonc` and `npx wrangler secret put DASHBOARD_TOKEN --config analytics-wrangler.jsonc`. Do not commit either value. The latter is entered in the dashboard on each browser session and is held in memory only.
5. Deploy: `npx wrangler deploy --config analytics-wrangler.jsonc`. Copy the resulting `https://...workers.dev` URL into `analytics-config.js`, commit that public URL, and wait for GitHub Pages deployment. Do not put either secret or a D1 identifier in `analytics-config.js`.
6. Open `analytics.html`, enter the dashboard token, and load the counters. Do not publish the token or share a screenshot containing it.

The Worker accepts POST `/event` only from the GitHub Pages origin in ordinary browsers and GET `/summary` with a bearer token. A browser origin check is not anti-fraud protection: scripted requests can forge traffic or clicks. For a high-traffic site, add Cloudflare rate limits, bot controls and monitoring. The telemetry is best used as directional activity, not an audited download metric.

## Data definitions

- Page views: consenting page loads, including repeat loads.
- Daily unique browsers: one count per consented browser ID per UTC day; the dashboard sums daily counts, so one person across days can count more than once. Devices, private browsing and blocked storage can also alter the count.
- Publisher clicks, open full-text clicks, PDF-link clicks: outbound link activations on the Research Library page. They do not measure time spent reading, content served by the destination, or completed downloads.
- Research topic graph: paper membership in an OpenAlex primary subfield where available, otherwise the catalogue's first topic or `Other research`. It is a topical grouping, not an embedding-based similarity model.

The browser ID is generated only after analytics consent and stored in local storage. The Worker hashes it with a secret and day before keeping it for 32 days; raw browser IDs, full IP addresses, search terms, and destination URLs are not stored in D1. Daily aggregate counts are retained until manually deleted. Declining analytics prevents visit and click events. Revisit the site's privacy wording and institutional requirements before enabling collection.
