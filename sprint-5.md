# Sprint 5 User Stories

## As a visitor (your downstream partner), I want to file a bug report against your API without creating an account so that reporting friction is zero.¶

The form is the entire app for an unauth visitor. They land on the URL, fill out the fields, submit, and see a confirmation. Field set should match the request body your POST /issues already accepts — required vs. optional follows the OpenAPI spec.

The route this app calls is the same public POST /issues you stood up in Sprint 3. No JWT, no auth headers — your BE accepts unauthenticated reports by design.

## As a visitor, I want clear feedback when my submission succeeds, fails validation, or fails because the API is down so that I know whether my report actually got through.¶

A real user hits all three states. Success: confirmation message, form clears or redirects. Validation failure: inline errors next to the offending fields, surfaced from the response your API returned. Network or server failure: a non-cryptic message that doesn't suggest the user did something wrong, and that preserves what they typed so they can retry.

