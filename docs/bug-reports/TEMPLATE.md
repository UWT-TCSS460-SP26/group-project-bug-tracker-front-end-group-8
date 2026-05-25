<!--
Copy this file to a dated entry when I file a bug in the partner's Bug
Tracker FE. Name it like: 2026-05-30-search-500-on-empty-query.md
Fill every field, then file the same content through their FE and add a row
to the Log table in README.md.
-->

# <one line title: route plus the surprise>

* **Filed:** <date> through the partner's Bug Tracker FE
* **Status:** filed
* **Partner audience (`aud`):** <the audience my token was scoped to>

## Endpoint

`<METHOD> <path>` on `<partner API base URL>`

Query or body I sent:

```
<the request, redacting any token>
```

## What their spec promised

<What the OpenAPI spec said this route returns. Quote the shape or status
code so they can see the gap without guessing.>

## What I actually got

<The real response: status code, body, headers that mattered. Paste it.>

## Repro steps

1. <step>
2. <step>
3. <step>

## What I already ruled out

<Token minted in the Token Playground for their audience decodes with the
right aud claim; redirect URI is registered; the request validates against
their spec. This shows the problem is on their side, not my NextAuth wiring.>