# Individual AI Workflows

## Mansur

### Context I prepared first

Before prompting, I made sure the agent had what it needed in the working
directory instead of trying to describe it all in chat:

- `sprint-5.md` — the sprint spec
- `openapi.yaml` — our team's API contract (so the agent could see `POST /v1/issues` and the `IssueInput` schema)
- The deployed BE URL (`https://tcss460-team-8-api.onrender.com`) noted in the README

I started in the repo's empty `mansurBranchFE` so the agent wasn't fighting
unrelated files.

### First prompt

> Read `sprint-5.md` and `openapi.yaml`. Build a Next.js (App Router) app
> with a single public form that POSTs to `POST /v1/issues`. Keep it simple.

**What the agent produced:** a `package.json`, `next.config.js`, `app/layout.js`,
and `app/page.js` with a working form that submitted to the API.

**What was good:** the field list matched `IssueInput` exactly
(`title`, `description`, `reproSteps`, `reporterEmail`) and the required/optional
split was right. Field length caps came from the spec, not invented.

**What missed:** the first cut used inline styles, hardcoded
`http://localhost:3000` as the API base, and didn't differentiate between
400 validation errors and network failures — every failure showed the same
generic message.

### Second prompt — fix the API URL handling

> Don't hardcode the API URL. Read it from `NEXT_PUBLIC_API_URL` at build
> time, strip a trailing slash if present, and surface a clear error if it's
> missing.

The agent moved the base URL into `process.env.NEXT_PUBLIC_API_URL`, added
`.replace(/\/+$/, "")`, and added an early-return error in `onSubmit` if it's
missing. I added `.env.local` + `.env.local.example` so anyone cloning the
repo can run it without guessing the variable name.

### Third prompt — split the three error states

> Per the sprint, success / validation-failure / network-failure each need
> distinct UI. On 201 show a confirmation with the returned issue id and
> clear the form. On 400, map the API's `error` string to the most likely
> field and show it inline. On network failure, keep what the user typed and
> show a non-blamey banner.

This produced the `mapServerError` helper and the `submittedId` / `globalError`
state split. I kept this almost as-is. The only thing I tweaked by hand was
moving focus to the success banner (`successRef.current?.focus()`) so screen
readers announce it — accessibility user story.

### What I kept

- The `Field` component (label + input/textarea + error + `aria-describedby` wiring) — clean and reusable.
- The 400-error → inline mapping by keyword.
- Environment-variable-driven base URL.

### What I cut / changed

- Tossed the inline style soup in favor of `globals.css`. Easier to read and lets the page actually look like a 2026 form instead of a 2012 one.
- Removed the agent's instinct to auto-generate Jest tests. The sprint doesn't require them, and they bloated the dependency tree. Christina's branch already has tests; if the team picks a composite, those can come along.
- Pulled out a `clientValidate` pass so the user gets fast feedback before a round trip — the BE still validates, this is just UX.

### What I'd prompt differently next time

- I'd hand the agent a one-page "non-goals" file alongside `sprint-5.md` saying things like "no auth, no admin views, no Tailwind, no test framework." It kept reaching for those and I had to redirect.
- I'd ask for the success state and accessibility hooks in the very first prompt instead of bolting them on later — the agent did them well when asked, but they weren't in its default first cut.
