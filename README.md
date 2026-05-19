# Bug Tracker FE — Group 8 (mansurBranchFE)

A single-page Next.js (App Router) app that lets anyone file a bug report
against our team's API. No auth — POSTs to the BE's `POST /v1/issues`.

**Live:** https://bug-tracker-fe-mansur.vercel.app

The browser posts to a same-origin `/api/issues` path, which Next.js rewrites
server-side to `${NEXT_PUBLIC_API_URL}/v1/issues`. This sidesteps CORS so the
deployed FE works without touching the BE's allowlist.

## Stack

- Next.js 14 (App Router, JavaScript)
- React 18
- Plain CSS (no Tailwind / UI library)

## Local dev

```bash
cp .env.local.example .env.local   # already provided
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Example | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://tcss460-team-8-api.onrender.com` | `next.config.js` — rewrite target. The browser hits `/api/issues`, Next rewrites it to `${NEXT_PUBLIC_API_URL}/v1/issues`. |

No URLs are hardcoded in component code. Already set on Vercel for Production
and Development.

## Deploy (Vercel)

1. Push this branch to GitHub.
2. Import the repo on Vercel; framework auto-detects as Next.js.
3. Add `NEXT_PUBLIC_API_URL` (Production + Preview).
4. Deploy. Verify the deployed FE origin is in the BE's CORS allowlist.

## UI states

- **Success** — 201 from API → green confirmation banner with the new issue id, form clears, focus moves to the banner.
- **Validation failure** — 400 → inline red error under the offending field (title / description / reproSteps / reporterEmail), inputs keep their values.
- **Network / server failure** — fetch throws or non-2xx/400 → red banner with a non-blamey message, inputs preserved so the user can retry.

## Accessibility

- Every field has a `<label htmlFor>` bound to its input.
- Errors are linked via `aria-describedby` and inputs get `aria-invalid="true"`.
- Success banner has `role="status"` and receives focus on submit so screen readers announce it.
- Global error banner uses `role="alert"`.

## Workflow writeup

See [`WORKFLOWS.md`](./WORKFLOWS.md) for Mansur's prompt-and-iterate log.
