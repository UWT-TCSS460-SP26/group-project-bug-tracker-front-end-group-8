# Bug Tracker FE, Group 8 (mansurBranchFE)

A single page Next.js (App Router) app that lets anyone file a bug report
against our team's API. No auth. The form POSTs to the BE's `POST /v1/issues`.

**Live:** https://bug-tracker-fe-mansur.vercel.app

The browser posts to a same origin `/api/issues` path, and Next.js rewrites
that on the server to `${NEXT_PUBLIC_API_URL}/v1/issues`. That sidesteps CORS
so the deployed FE works without anyone touching the BE's allowlist on Render.

## Stack

* Next.js 14 (App Router, JavaScript)
* React 18
* Plain CSS, no Tailwind, no UI library

## Environment variables

`NEXT_PUBLIC_API_URL` is the rewrite target. Example value:
`https://tcss460-team-8-api.onrender.com`. The browser hits `/api/issues`,
Next forwards it to `${NEXT_PUBLIC_API_URL}/v1/issues`. No URLs live in
component code. The variable is already configured on Vercel for Production
and Development.

## Deploy (Vercel)

1. Push this branch to GitHub.
2. Import the repo on Vercel. The framework auto detects as Next.js.
3. Add `NEXT_PUBLIC_API_URL` for Production and Preview.
4. Deploy. Because the rewrite proxies the call server side, the BE's CORS
   allowlist does not need to know about the Vercel origin.

## UI states

* **Success.** 201 from the API. Green confirmation banner shows the new
  issue id, the form clears, and focus moves to the banner.
* **Validation failure.** 400 from the API. Inline red error under the
  offending field (title, description, reproSteps, or reporterEmail). Inputs
  keep their values so the user can fix and retry.
* **Network or server failure.** Fetch throws or the API returns a non 201
  status that isn't 400. Red banner with a calm message, inputs preserved.

## Accessibility

* Every field has a `<label htmlFor>` bound to its input.
* Errors are linked via `aria-describedby` and inputs get `aria-invalid="true"`.
* Success banner uses `role="status"` and receives focus on submit so screen
  readers announce it.
* Global error banner uses `role="alert"`.

## AI Workflow, Mansur

For Sprint 5 the course bar of "every member can explain every line" is
paused. What I own this sprint is this writeup, the team's pick or merge
decision, and a deployed FE that actually works against our API. The code
itself came from an agent. The thinking about how to drive the agent is mine.

### Context I prepared before prompting

I started in a clean working directory on `mansurBranchFE`. Before I typed
a single prompt I made sure the agent could find:

* `sprint-5.md`, the sprint spec
* `openapi.yaml`, our team's API contract, so the agent could see the exact
  `IssueInput` shape for `POST /v1/issues`
* a note in the README pointing at our deployed BE on Render

I wanted to see how little prompting I could get away with if the context
was solid. That mindset paid off. My prompts stayed short.

### First prompt

> Read `sprint-5.md` and `openapi.yaml`. Build a Next.js (App Router) app
> with a single public form that posts to `POST /v1/issues`. Keep it simple.

The first cut included `package.json`, `next.config.js`, `app/layout.js`,
and `app/page.js`. The form already had the four correct fields from
`IssueInput` with the right required and optional split, and the length
caps came straight from the spec. That part was solid out of the gate.

What it got wrong: the API base was hard coded to `http://localhost:3000`,
every failure showed the same generic message, and the markup leaned on
inline styles that looked like 2012 instead of 2026. Nothing fatal, just
not done.

### Second prompt, fix the API URL handling

> Don't hard code the API URL. Read it from `NEXT_PUBLIC_API_URL` at build
> time, strip a trailing slash if present, and surface a clear error if it's
> missing.

The agent moved the base into `process.env.NEXT_PUBLIC_API_URL`, normalized
the trailing slash, and added an early return if the variable was missing.
I added `.env.local` and `.env.local.example` myself so anyone cloning the
repo would not have to guess the variable name.

### Third prompt, split the three error states

> Per the sprint, success, validation failure, and network failure each
> need distinct UI. On 201 show a confirmation with the returned issue id
> and clear the form. On 400 map the API's `error` string to the most likely
> field and show it inline. On network failure keep what the user typed and
> show a calm banner.

This produced the `mapServerError` helper and the split between
`submittedId` and `globalError` state. I kept this almost as is. The only
thing I added on my own was moving focus to the success banner with a ref,
so screen readers announce it. That covers the accessibility user story.

### Fourth round, the CORS surprise

After I deployed to Vercel the page loaded fine but real form submissions
were going to fail because the BE on Render doesn't have the Vercel origin
in its CORS allowlist, and I don't have Render access. Rather than chase
that I prompted the agent to add a Next.js rewrite that proxies
`/api/:path*` to `${NEXT_PUBLIC_API_URL}/v1/:path*` and updated the fetch
to hit `/api/issues`. Same origin in the browser, no preflight failures,
problem gone. I verified it end to end with curl against the deployed URL
and the BE filed real issues (`#29` and `#30` in our database).

### What I kept

* The reusable `Field` component the agent generated, which wires up the
  label, input or textarea, error text, and `aria-describedby` cleanly.
* The keyword based mapping from a 400 `error` string back to the
  responsible field.
* The `NEXT_PUBLIC_API_URL` driven base and the rewrite trick to dodge CORS.

### What I cut or rewrote

* Inline styles. I moved everything to `globals.css` with a small dark
  themed look so the form actually felt like it belonged in 2026.
* Tests. The agent reached for Jest and React Testing Library on its own.
  The sprint does not require them and they bloated the dependency tree.
  Christina's branch already has a tested version, so if the team picks a
  composite those can come along then.
* A long over engineered error tree. I simplified it down to "did the
  server reply with a known field name in the error string, yes or no."

### What I would prompt differently next time

* I would hand the agent a one page "non goals" file alongside `sprint-5.md`
  saying things like "no auth, no admin views, no Tailwind, no test
  framework, no TypeScript." It kept reaching for those on its own and I
  burned prompts redirecting it.
* I would ask for the three error states and the accessibility hooks in
  the very first prompt instead of bolting them on later. When asked the
  agent did them well. Left to its own defaults it did not bother.
* I would mention the deployment topology up front: BE on Render, FE on
  Vercel, you do not own the BE CORS list. If I had said that on day one
  the agent would have reached for the rewrite immediately instead of me
  finding the broken preflight after deploy.
