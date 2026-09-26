# Research Library

A GitHub Pages search interface for AI, machine learning, deep learning, and data science papers. Enter a DOI for exact lookup or a title for live search across Crossref records from 2015 onward. The site queries OpenAlex and Europe PMC for open full-text locations. It can be hosted with GitHub Pages. The catalogue starts with a small, verified seed set. Additional entries should be checked against authoritative metadata and legitimate open full-text locations.

## Add papers

Edit `papers.json` as a JSON array. Example schema (replace the placeholders with verified records):

```json
[
  {
    "title": "Paper title",
    "authors": "A. Author; B. Author",
    "venue": "Journal or conference",
    "year": 2025,
    "doi": "10.xxxx/example",
    "publisher_url": "https://example.org/record",
    "open_url": "https://repository.example.org/authorized-copy.pdf",
    "topics": ["Machine learning", "LLMs"]
  }
]
```

`open_url` may be an openly accessible publisher copy, institutional repository manuscript, or authorized preprint. Leave it empty if no verified open copy is available. DOI links should identify the version of record. Do not commit institutionally downloaded subscription PDFs, authentication cookies, proxy links, or credentials.

## Publish

This repository is published with GitHub Pages from the `main` branch and root directory at `https://abneil.github.io/research-library/`.

## Catalogue growth

Use a defined source and scope before bulk importing. Crossref exposes publication metadata, while OpenAlex records an `open_access.oa_url` and `best_oa_location` where it knows an open copy. Verify identifiers, deduplicate DOI records, and review access links before publishing. The dataset is curated; it does not claim exhaustive coverage of all venues or papers.

## Live search and limitations

Title search requests up to 10 Crossref matches published since 2015 and checks each DOI against all open locations reported by OpenAlex and an open full-text match in Europe PMC. DOI lookup first tries OpenAlex and falls back to Crossref. Locations are deduplicated by URL and labelled with host, manuscript version and licence when the source supplies those fields. The request option is always available, including when an open version exists but a particular version is needed. The result set is not a comprehensive inventory of every AI paper; Crossref coverage and ranking vary, and the location services may miss an available copy. “No open copy identified” is not proof that none exists. A reported URL can also become unavailable. A link labelled open PDF points to the hosting publisher or repository; PDF download depends on that host. No subscription PDFs are stored here.

The current static implementation uses anonymous OpenAlex calls, which have a limited budget and may be throttled. For sustained public use, add a small server-side search endpoint with an OpenAlex API key stored as a server secret, response caching, and rate limiting. Never commit a personal key to this repository or embed it in browser JavaScript.

## Reading and private-sharing workflow

Each result links to its original publisher page. When an open location is known, readers can open it on the publisher or repository host. Every result also offers a prepared email request to the project lead; this does **not** confer access. Before any individual copy or publisher share link is sent, the project lead must verify the specific article, publisher terms, institutional licence, recipient and approved sharing method. Any approved private link belongs in the authorised channel, not in this public repository or `papers.json`.

Do not proxy institutional sessions, embed access tokens, upload subscription PDFs, or present subscription content in an iframe through someone else's credentials.

## Additional sources

CORE offers a full-text API but requires an API credential. Unpaywall DOI requests require an email parameter. Neither is embedded as an assumed public credential in this static site. A future server endpoint could add those sources, cache responses, deduplicate versions and keep credentials private. Europe PMC is most relevant to papers in its subject coverage; the DOI check only adds an article when the returned DOI matches and an open PMC full-text identifier is supplied.

## Optional reading analytics

The repository includes an analytics dashboard (`analytics.html`) and a Cloudflare Worker/D1 implementation in `analytics-worker.js`, `analytics-schema.sql` and `analytics-wrangler.jsonc`. Until its backend is deployed and `analytics-config.js` contains the Worker URL, collection is off and the dashboard reports that setup is incomplete. Once configured, visitors choose whether to contribute aggregate activity counts. The dashboard requires a private token. See [ANALYTICS.md](ANALYTICS.md) for deployment and precise metric definitions. The topic graph is a dynamic grouping of clicked papers by reported research topic. The site can record outbound PDF-link clicks but cannot verify a download on a publisher or repository website.
