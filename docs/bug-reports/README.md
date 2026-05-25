# Bug reports filed against our upstream partner

This is my record of every bug I file against our upstream partner's API
during Sprints 6 through 8. The bugs themselves get filed in **their** Bug
Tracker FE, not here and not on Slack. This folder is just my copy of what I
sent and where it stands, so the team has a paper trail when a contract
surprise turns into a back and forth.

**Partner Bug Tracker FE:** https://group-project-bug-tracker-front-end-mu.vercel.app/
<!-- The URL I collected in Story 1. This is the only place I file. -->

## Why this channel and not Slack

The course built the Bug Tracker system for exactly this kind of cross team
contract friction, so using it is the assignment. When I file through the
partner's FE, their team triages it on their side with Postman or Prisma
Studio against their admin gated routes, the same way our downstream partner
files against us and we triage on ours. A Slack ping leaves no record and no
queue. A filed bug does.

## What counts as a bug worth filing

I file when their API breaks the contract their OpenAPI spec promised:

* a response shaped differently than the spec said, or a field the spec did
  not mention
* a 500 on a request that looks valid against the spec
* a token rejected that decodes correctly with the right `aud` claim for
  their audience

Before I file I mint a token for their audience in the TCSS 460 Token
Playground and hit the route out of band. That tells me whether the problem
is their API or my NextAuth wiring, so I am not filing a bug that turns out
to be my own redirect URI or audience mistake.

## What goes in every report

Every bug I file carries the same four things, which is what their form asks
for. I copy each filed bug into its own dated file in this folder using
`TEMPLATE.md`:

| Field | What it holds |
| --- | --- |
| Title | One line naming the route and the surprise |
| Description | What I expected from their spec versus what I got |
| Endpoint | The exact method and path I hit, plus query or body |
| Repro steps | Numbered steps another person can follow to see it again |

## Log

No bugs filed yet. As of the start of Sprint 6 I have their Bug Tracker FE
URL but have not yet consumed enough of their API to hit a real surprise.
The read only pages land first; the first real contract break gets logged
here the moment I find one.

| Date | File | Title | Endpoint | Status |
| --- | --- | --- | --- | --- |
| _none yet_ | | | | |

Status values I use: `filed` (sent through their FE), `acknowledged` (they
responded), `fixed` (verified on my side), `wontfix` (they closed it as
intended behavior).
