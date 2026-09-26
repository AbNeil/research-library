# Research Library

A static, searchable index of AI, machine learning, deep learning, data science, and language model papers. It can be hosted with GitHub Pages. The catalogue starts with a small, verified seed set. Additional entries should be checked against authoritative metadata and legitimate open full-text locations.

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
