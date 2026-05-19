# Deployed URL
https://group-project-bug-tracker-front-end-mu.vercel.app/

# AI Workflows

## Christina
My first prompt was "Create a Next.js app with a single public form that posts to POST /issues. 
Read openapi.yaml and sprint-5.md to understand the backend API and what features are requested."
It produced a Next.js app that rendered properly when I tested locally:
![img.png](christina_example.png)
Error messages were user-friendly as specified in this sprint's user stories. However, the
model assumed I was running the backend API locally, so the server connection was failing.
To solve this, I pointed the agent to our team's backend web service, and it updated `app/page.js`
to point to the deployed API. The connection was still failing, so I re-prompted to try to find
a better solution. The agent rewrote `next.config.js` to proxy requests from the local dev server
to the Render API to solve CORS issues, then updated the `fetch` URL in `app/page.js` to use the
rewrite. This solved the server issues.
Finally, I prompted it to create a `.gitignore` file for the project, and create tests, located within
`test/page.test.js`. It took a few iterations of prompting to solve issues with failing tests related 
to `TestingLibraryElementError` errors.
Once everything worked locally, I prompted the agent with the "As a frontend developer, I want the 
form to talk to our deployed API (not localhost) so that the deployed FE actually works end-to-end" 
user story to ensure the app will work if we decide to deploy this implementation with Vercel. 


## Charlene

I started by setting up my context. In an empty directory in github I added a sprint-5.md, the openapi.yaml and schema.prisma from our backend, and a README.md. The sprint-5.md was text copied and pasted from the sprint-5 instructions, but trimmed down to necessary information only. In the README.md, I put the backend URL and an example of our POST /issues request body.

Once the context was setup, I directed Claude Code Web to this directory and gave it the following prompt: "Read these files. Build the Bug Tracker FE described in the sprint-5.md document against the API in the spec. The backend-openapi.yaml and backend-schema.prisma files are from our team's backend API that has the issues routes."

![img.png](charlene_example.png)

I was satisfied with the bug tracker Claude first produced as long as it functioned properly. After testing network-error, validation-error, and success cases, I was completely satisfied with this form. It looks clean, the messages are clear, and it functions as intended. I especially like how the respective required field is outlined red when the user tries to submit a form without it. The only other prompts I made were to get help setting up the CORS, so I could test the form.

If I did this over again, I don't know if I would have bothered with Claude Code. There was a lot of difficulty connecting it to github with the proper authentication and I only had four context files that would have been easy to copy-paste into the Claude browser. However, it was nice that whole frontend was setup for me and all I had to do was pull it from github onto my local machine. Without any Next.js experience, this may have been challenging to setup on my own. 
