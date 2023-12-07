import dotenv from "dotenv";
import { Octokit, App } from "octokit";
import { DEBUG } from "./auth/options";
// import fs from "fs";
// import http from "http";
// import { createNodeMiddleware } from "@octokit/webhooks";

// Load environment variables from .env file
dotenv.config();

// Set configured values
const appId = process.env.APP_ID as string;
const privateKey = process.env.GITHUB_PRIVATE_KEY as string;
const secret = process.env.WEBHOOK_SECRET as string;
const clientId = process.env.GITHUB_CLIENT_ID as string;
const clientSecret = process.env.GITHUB_CLIENT_SECRET as string;

const enterpriseHostname = process.env.ENTERPRISE_HOSTNAME as string;

const messageForNewPRs = `
### Thanks!

\- Donald, Owner of IMG Funnels
`;

// Create an authenticated Octokit client authenticated as a GitHub App
const app = new App({
  appId,
  privateKey,
  oauth: { clientId, clientSecret },
  webhooks: {
    secret
  },
  ...(enterpriseHostname && {
    Octokit: Octokit.defaults({
      baseUrl: `https://${enterpriseHostname}/api/v3`
    })
  })
});

(async () => {
  let _app = await app.octokit.request("/app");
  if (DEBUG) {
    console.log("GH Helper", !!_app);
  }
})();

export default app;
