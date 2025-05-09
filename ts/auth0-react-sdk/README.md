# Auth0 React SDK + Encore App Example

This is an example of how to do user authentication using [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react) together with an Encore app.

For this example the login/logout flow is abstracted away by the Auth0 React SDK, then in the Encore auth handler the JWT token is verified and the user is authenticated.
You an also take a look at [auth0](https://github.com/encoredev/examples/blob/main/auth0) for an example where the login/logout flow is done through Encore and the frontend is React + React Router.

## Cloning the example

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run to clone this example:

```bash
encore app create --example=ts/auth0-react-sdk
```

## Auth0 Credentials

Create an Auth0 account if you haven't already. Then, in the Auth0 dashboard, create a new *Single Page Web Applications*.

Next, go to the *Application Settings* section. There you will find the `Domain` and `Client ID` that you need to communicate with Auth0. 
Copy these values, we will need them shortly.

A callback URL is where Auth0 redirects the user after they have been authenticated. Add `http://localhost:3000` to the *Allowed Callback URLs*. 
You will need to add more URLs to this list when you have a deployed frontend environment. 

The same goes for the logout URL (were the user will get redirected after logout). Add `http://localhost:3000` to the *Allowed Logout URLs*.

Add `http://localhost:3000` to the *Allowed Web Origins*.

Click the *Advanced Settings* at the bottom of the page and go to the *Certificates* tab. Download the PEM certificate.

Next in the Auth0 dashboard, go to the *APIs* page.

Create a new API, give it a name and an identifier. When the API is created, copy the `API Audeience`URL.

### Config values

In `backend/auth/config.ts`, replace the values for the `Domain` and `Audience` that you got from the Auth0 dashboard.

In `frontend/.env` file, replace the values for `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` and `VITE_AUTH0_AUDIENCE` that you got from the Auth0 dashboard.

Set the PEM certificate as an Encore secret. From your terminal (inside your Encore app directory), run:

```bash
encore secret set --dev Auth0PEMCertificate < your-downloaded-cert.pem
```

## Developing locally

Run your Encore backend:

```bash
encore run
```

In a different terminal window, run the React frontend using [Vite](https://vitejs.dev/):

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Encore's Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change
to an Encore endpoint.

```bash
npm run gen # Locally running Encore backend
```

## Deployment

### Encore Backend

#### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/ts/self-host/build) for how to use `encore build docker` to create a Docker image and configure it.

#### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

#### Link to GitHub

Follow these steps to link your app to GitHub:

1. Create a GitHub repo, commit and push the app.
2. Open your app in the [Cloud Dashboard](https://app.encore.dev).
3. Go to **Settings ➔ GitHub** and click on **Link app to GitHub** to link your app to GitHub and select the repo you just created.
4. To configure Encore to automatically trigger deploys when you push to a specific branch name, go to the **Overview** page for your intended environment. Click on **Settings** and then in the section **Branch Push** configure the **Branch name** and hit **Save**.
5. Commit and push a change to GitHub to trigger a deploy.

[Learn more in the docs](https://encore.dev/docs/platform/integrations/github)

### React frontend

#### Vercel

The frontend can be deployed to Vercel. Follow these steps:

1. Create a repo and push the project to GitHub.
2. Create a new project on Vercel and point it to your GitHup repo.
3. Select `frontend` as the root directory for the Vercel project.

Once you have your frontend deployed:
* Update the *Allowed Callback URLs*, *Allowed Logout URLs* & *Allowed Web Origins* settings in your application on Auth0 with the deployed Vercel URL. 
* Set the `allow_origins_with_credentials` in the `encore.app` (see below) file to the deployed Vercel URL.

## CORS configuration

If you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which
origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `encore.app`
file, which has the following structure:

```js
global_cors: {
  // allow_origins_without_credentials specifies the allowed origins for requests
  // that don't include credentials. If nil it defaults to allowing all domains
  // (equivalent to ["*"]).
  "allow_origins_without_credentials": [
    "<ORIGIN-GOES-HERE>"
  ],
        
  // allow_origins_with_credentials specifies the allowed origins for requests
  // that include credentials. If a request is made from an Origin in this list
  // Encore responds with Access-Control-Allow-Origin: <Origin>.
  //
  // The URLs in this list may include wildcards (e.g. "https://*.example.com"
  // or "https://*-myapp.example.com").
  "allow_origins_with_credentials": [
    "<DOMAIN-GOES-HERE>"
  ]
}
```

More information on CORS configuration can be found here: https://encore.dev/docs/ts/develop/cors
