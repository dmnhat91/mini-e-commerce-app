# mini-e-commerce-app

## Description

### Solutions

This application follows the following solutions to solve problems that a simple app may face.
![Solutions](images/Solutions.png)

### App overview

This is a ticketing app.
![Description of app feature](images/Overview.png)
![Overall design](images/Overview2.png)
We build **common** library that helps share a bund of codes among services.

### App screen mockup

![Start screen](images/Screen1.png)
![Signup screen](images/Screen2.png)
![Logged in screen](images/Screen3.png)
![Summary screen](images/Screen4.png)
![Confirmation screen](images/Screen5.png)
![Payment screen](images/Screen6.png)

#### Signup and signin view

![Signup screen](images/signup-view.png)
![Signin screen](images/signin-view.png)

### Database storage

We need storage to store User, Ticket, Order, Charge.
![Objects for storage](images/Objects4Storage.png)

![MongoDB storage](images/MongoDBStorage.jpeg)
![MongoDB storage for auth](images/MongoDBStorage2.jpeg)
![MongoDB storage for auth2](images/MongoDBStorage3.jpeg)
![MongoDB storage for auth3](images/MongoDBStorage4.jpeg)

### Password hash

![Password Hash](images/PasswordHash.jpeg)

### Services

![Services](images/Services.png)

### Events

![Events](images/Events.png)

### Auth Service Apis

![Auth APIs](images/AuthAPIs.png)

Currently Auth Service is listening at **port 3000**

#### Authentication Approach

Idea: <br/>
![Approach](images/approach.jpeg)
A request to buy ticket needs to contain some form of authentication for the Orders service to verify. <br/>

2 ways to implement this is:

1. Fundamental Option 1: Individual services rely on the auth service
   ![Auth Approach 1](images/auth-approach-1.jpeg)

However using this way, if Auth service is crashed. Whole app is crashed.

2. Fundamental Option 1.1: Individual services rely on auth service as a gateway
   ![Auth Approach 1.1](images/auth-approach-11.jpeg)

We still 100% rely on Auth service. We have the same cons as the Option 1.

3.  Fundamental Option 2: Individual services know how to authenticate a user
    ![Auth Approach 2](images/auth-approach-2.jpeg)

We choose approach **Option 2** because we can eliminate the dependency of Auth service. However, this can create code duplication. But we can mitigate it by using a common library.

Some other downsides of this approach. Let's look at the following flow:
![Signin flow](images/first-signin-flow.jpeg)
If we follow this approach, the User will provide us the token and can do whatever he/she wants.

Scenario where UserABC is a bad person and we want to ban:
![Ban Case](images/ban-case.jpeg)
But the user still has valid token?
![Prob with ban case](images/problem-with-ban.jpeg)
We cannot ask the Auth service as it now will create the dependency.
To summarise the problem:
![Prob summary](images/prob-summary.jpeg)

We will go with Option #2. And there is a solution to solve this but it takes a lot of work so out of the scope of project:
![Auth solution step 1](images/auth-solution-1.jpeg)

![Auth solution step 2](images/auth-sol-step-2.jpeg)
OR
![Auth solution step 2.2](images/auth-sol-step-22.jpeg)
We can reject straight away if the token expire without communicating with Auth service. And tell the client to do it himself/herself.

However, with both approaches, there is a window of time where user gets banned but still can make request. Here is another solution to solve this thing:
![Auth solution another way](images/auth-sol-another-way.jpeg)
User ban event will be consumed by other services and shortlive there. You can temporarily store this for the amount of time equal to the lifetime of the token.

**Authentication requirements**

1. The Auth service is not just to check a user whether he/she is authenticated or not. It also needs to provide more details of the user to see whether they are allowed to purchase tickets.
   ![Auth Req 1](images/auth-req-1.jpeg)
2. Quite similar to requirement 1, this is for Admin to create free coupons.
   ![Auth Req 2](images/auth-req-2.jpeg)
3. Need to implement token expiration mechanism. This must be secure so that the user cannot tamper the expiry time of the token. This implies the importance of using the JWT (because cookie is easily tampered - we are asking the browser to expire the cookie. However, the user can easily copy the information in cookie and continue to use)
   ![Auth Req 3](images/auth-req-3.jpeg)
4. One of goals of microservices is to allow different services written in different languages. Hence Auth service need to support this thing. And we don't want each service to implement extra storage/database to store the auth information.
   ![Auth Req 4](images/auth-req-4.jpeg)

To summary:
![Auth Req Summary](images/auth-req-summary.jpeg)

**Issues with JWT**
Let's look at how a normal flow looks like:
![Normal React Flow](images/normal-react-flow.jpeg)

Considering 3 requests, which point in time can we communicate the authentication information from browser to backend?
![Normal React Flow 2](images/normal-react-flow-2.jpeg)

However, we are building a SERVER-SIDER RENDERED React App. The idea is that we make some initial request (GET ticketing.dev) to backend server. The backend server then render/build the HTML and send the HTML file with all contents inside of it (aka. all the relevant orders, tickets, etc.). The browser just display the full content without having to send later quests. The reason we are using server-side is for SEO (search engine optimization) and in case users have other devices like mobile devices.
![Server Side React](images/server-side-react.jpeg)

And because we need to send authentication info within only one request. Cookie supports this.
![Server Side React 2](images/server-side-react-2.jpeg)
![JWT solution via Cookie](images/jwt-solution.jpeg)

To summarise the Auth flow:

**When signup**
![Auth Flow summary](images/auth-flow-summary.jpeg)
![Auth Flow summary 2](images/auth-flow-summary2.jpeg)
**When signin**
![Sign in](images/signin-flow.jpeg)
**Current user check**
![JWT verification](images/jwt-verify.jpeg)
**Current user middleware implementation**
![Current user middleware](images/current-user-middleware.jpeg)

### Technologies used

1. Next.js: server side rendering React framework.
2. MongoDB
3. Redis
4. NATS streaming server

### Error handlings

![Error handling methods](images/error-handlings.png)

Express error handling: https://expressjs.com/en/guide/error-handling.html

#### Common response structure

Errors are an aray of objects. And each has a message and maybe a field.

![Common response structure](images/common-response.png)

## Project setup

1. In **ticketing/auth/**:
   1. Run `npm init -y`
   2. Run `npm install typescript ts-node-dev express @types/express`
   3. Run `tsc --init` (this produces _tsconfig.json_)
   4. Replace the _"test": "xxxxx"_ script in package.json with _"start": "ts-node-dev src/index.ts"_
      ![Pic 1](images/packagejsondemo.png)
      ![Pic 2](images/packagejsondemo2.png)
   5. Then `run npm install` (this will runs the command _ts-node-dev src/index.ts_ when npm starts)
   6. Install express validator to assist us to validate user data: `npm install express-validator`
   7. Install async error handling package library `npm install express-async-errors`
   8. Install mongoose for MongoDB `npm install mongoose`
   9. Install cookie-session for Authentication `npm install cookie-session @types/cookie-session`
   10. Install jsonwebtoken for JWT `npm install jsonwebtoken @types/jsonwebtoken`
   11. Install Jest library for writing tests `npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server`. We use `--save-dev` to indicate this is development denpendencies (only use for testing at local) and we don't want to download and build into Docker images as it is quite heavy.
   12. Run `npm run test` for running tests. Use `Control + C` to stop the tests running. Whenever you update the file and believe the tests are passed but Jest stills show failed test, try restarting the tests.
2. In **ticketing**:

   1. Run `skaffold dev` to start skaffold

3. In **ticketing/client/**:
   1. Run `npm init -y`
   2. Run `npm install react react-dom next`
   3. Set up the running script in package `"dev": "next"`, then you can run `npm run dev` to run nextJs at local (by default it will point to localhost:3000).
   4. Run `npm install bootstrap`
   5. Run `npm install axios`

### Host File Tweak

You need to trick Ingress to think the domain configured in `ingress-srv.yaml` is localhost.
For MacOS/Linux:

- Add `127.0.0.1 posts.com` to `/etc/hosts`
  For Windows:
- Add `127.0.0.1 posts.com` to `C:\Windows\System32\Drivers\etc\hosts`

### Running on cloud

#### Scenarios

![Synced files](images/SyncedFile.png)
![Unsynced files](images/UnsyncedFile.png)

Cloud will run your k8s cluster instead of your local machine.
![Cloud setup](images/Cloud.png)

Why google cloud? Because skaffold is developed by google team. Hence it supports many features for google cloud.

#### Step 1: Create your first project on Google Cloud (let's call ticketing-dev)

![Create Google Cloud Project](images/cloud-step-1.png)

#### Step 2: Create Kubernetes cluster on Google Cloud

Create Kubernetes Cluster: Menu bar > Kubernetes Engine > Clusters
![Create Kubernetes Cluster](images/cloud-step-2.png)

Enable the Kubernetes service (if not yet enabled). It could take several minutes.
![Enable K8s services](images/cloud-step-3.png)

After setup finishes, create the cluster.
![Just choose the standard one](images/cloud-step-4.png)

Follow the following setup. Note: you should choose zone that is close to your physical location for best performance.
![Setup cluster](images/cloud-step-5.png)

Click on **default-pool** > **Nodes** on the menu bar, then just choose a small virtual machine is enough:
![Nodes setup](images/cloud-step-6.png)

Then finally click **Create**. It may take some time to create.

#### Step 3: Connect to Google Cloud cluster

Kubectl contexts are (or can be understood as) settings that tell Kubernetes to connect to different cluster in the world.
![KubeCtl contexts](images/Kubectl-context.png)

You may be currently connecting to your local cluster through a context we created when first installed Docker for Mac/Windows. You can check the context:
![Example of contexts](images/k8s-example.png)

We need to add in a second context to tell kubectl how to connect to the cluster we created on Google Cloud.

We need to install Google Cloud SDK to teach our k8s to connect.
Link: https://cloud.google.com/sdk/docs/quickstart

If setup successfully on Command Line, it can understand command `gcloud`.
Now we can login by running command: `gcloud auth login`
Then `gcloud init` then follow the guide

Now we can create context. There are 2 options:
![Create GCloud k8s context](images/cloud-step-7.png)

Notice on the docker desktop, new context is created (we can now toggle between cluster contexts):
![Create GCloud k8s context 2](images/cloud-step-8.png)

#### Step 4: Setup skaffold

![Steps to setup skaffold for GCloud](images/cloud-step-9.png)

Go to console > Find cloud build > Enable the build
![Cloud build](images/cloud-step-10.png)

Update the skaffold.yaml file. Just need to make small changes.
![Small changes to skaffold file](images/cloud-step-11.png)
Remember to update image name in deployment file as well (in our case.. auth-depl.yaml)

#### Step 5: Setup ingress-nginx

Just follow this link: https://kubernetes.github.io/ingress-nginx/deploy/#quick-start
Copy and run the command line:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml`
Make sure connet to correct context (aka. gcloud context)

Also need to follow this guide as we are using GCloud: https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke

Copy and run the command line:
`kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)`

Copy and run the command line:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml`

After running a load balancer is created for us. To see the load balancer, see here:
![Load balancer on GCloud](images/cloud-step-12.png)

Get the IP address of the load balancer:
![Load balancer IP](images/cloud-step-13.png)

Change the IP address in host file:
![Host file tweak](images/cloud-step-14.png)

#### Step 6: Restart skaffold

Just make sure the context is for GCloud. Then go to the directory and run `skaffold dev`

### JWT Creation

**Storing JWT secret on Kubernetes**
![JWT Secret Storage](images/store-secret-in-k8s.jpeg)

Command line: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf`

To explain:

- `generic`: create a generic secret
- `jwt-secret`: the name of the secret (mostly used for logging purposes, also can be used to refer to a pod inside config file)
- `--from-literal`: where we defines key value pairs for the secret. Currently we only assign 1 key value pair: `jwt=asdf`

To get list of secrets: `kubectl get secrets`

### For running tests

The `supertest` library helps to target a service to available port of our local machine for testing.

### Basics of NextJS

NextJS manages files as routes. For example, if we have 2 files `index.js` and `banana.js`. It treats `index.js` as homepage (aka. `localhost`) and we can access `banana.js` using `localhost/banana`. File names map up to route names. It might take time to loadup server.

If we put `signup.js` inside a folder called `auth` then the path becomes `localhost/auth/signup` to access the page.

In this project, using TypeScript for NextJS is not a good idea, we will have to write quite a lot of definitions for TypeScript. So instead we opt for JavaScript (just for NextJS only for frontend side).

The following diagram shows how NextJS works:
![NextJS basics](images/nextjs-server-render.png)

1. When we make a request to NextJS, it looks at incoming request and based on the URL, it decides what component to show (such as the "signup" page, or "banana" page).
2. Then for each of those components, it call `getInitialProps` static method. This is our opportunity to attempt to fetch some data the component needs before rendering process.

```
const LandingPage = () => {
   return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = () => {
   // you define your code here
};

export default LandingPage;
```

3. Once `getInitialProps` is invoked, anything return from it is going to provided to our component as a prop.
4. NextJS then takes HTML from all components rendered and send back full response.

Code example:

```
const LandingPage = ({color}) => {
    console.log('I am in the component', color);
    return <h1>Landing Page</h1>;
 };

 LandingPage.getInitialProps = () => {
    console.log('I am on the server!');

    return {color: 'red'};
 };

 export default LandingPage;
```

`getInitialProps` scenario:
![getInitialProps image 1](images/getIntialProps.png)
![getInitialProps image 2](images/getInitialProps2.png)
![getInitialProps for AppComponent](images/multiple-getinitial-props-2.png)

### Global CSS

Can refer to the following documentation: `https://github.com/vercel/next.js/blob/canary/errors/css-global.md`

### To check response when submitting

You can go to Inspect > Network > XHR > Choose between Headers and Preview (assuming using Google Chrome)

![Cookie inspection](images/inspect-cookie.png)

Or you can go to Inspect > Application > Select the Cookie
![Cookie inspection 2](images/inspect-cookie-2.png)

### useRequest hook

![useRequest hook](images/useRequestHook.png)

## Debug

### Error 1:

```
build [us.gcr.io/ticketing-dev-345514/auth] failed: getting cloudbuild client: google: could not find default credentials. See https://developers.google.com/accounts/docs/application-default-credentials for more information.
```

Resolved url: https://stackoverflow.com/questions/41507904/could-not-find-default-credentials

Summary: Run this command `gcloud auth application-default login`

### Error 2:

If skaffold unable to watch for changes, then add:

```
Try adding "--poll" to your start script

scripts: {

    "start": ts-node-dev --poll src/index.ts"

}
```

![Resolve reload issue](images/reload-issue-solve.png)

### Error 3:

If you use this code for the landing page:

```
import axios from 'axios';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
    axios.get('/api/users/currentuser');

    return <h1>Landing Page</h1>;
 };

 LandingPage.getInitialProps = async () => {
    const response = await axios.get('/api/users/currentuser');

    return response.data;
 };

 export default LandingPage;
```

You get error ECONNREFUSED. This is due to the Kubernetes. What is actually happening?
![ECONNREFUSED err explain](images/econnrefuse-explain.png)

1. We make request GET ticketing.dev to browser and we already modify host file to translate it to 127.0.0.1:80 (the port is set to 80 by default as we don't specify it).
2. The port is bound to Ingress Nginx and route off appropriately. Because there is no path specified, the Nginx decides to forward to Client.
3. NextJS receives the request, builds up some HTML document and send back to us.
4. We receive Fully rendered HTML file on browser.
5. And then if we use Axios to call inside React component for request '/api/users/currentuser', it is still successful because the browser, by default, assumes the request is using the current domain 'ticketing.dev' (although we did not specify it).

![ECONNREFUSED err explain 2](images/econnrefuse-explain-2.png)

1. Now for the case we call request inside getInitialProps, NextJS makes request to networking layer. The networking is just some kind of stuff implemented by nodes http layer (works similar to the browser). And this networking assumes of using localhost (aka. 127.0.0.1:80) because you don't specify the domain. BUT we are running it inside a container, the localhost is the local env of the CONTAINER.

How to solve this?
We can config Axios to make request based on whether it is from NextJS server or from our local machine.
There are 2 ways as decribed in following pic.
![ECONNREFUSED err solution](images/econnrefuse-sol.png)
Option 1 is better as it doesn't require us to know the service name (aka. auth-srv defined in K8s file). We just need to reach out to Ingress Nginx and let it route for us.
There is still a challenge. How do we know exactly what domain to put there for option 1? And the request also need to include Cookie for current user.
In the world of k8s, we can use name `auth-srv` only when we are in the same namespace.
![k8s namespace](images/k8s-namespace.png)
So we cannot use name like `ingress-nginx-srv` to connect to the Ingress Nginx because it is in different namespace. We need to cross namespace:
![cross namespace](images/cross-namespace.png)
We use syntax: `http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local`
To know the NAMESPACE, run `kubectl get namespace`
To know the NAMEOFSERVICE, run `kubectl get services -n [namespace]` (by default, it list out `default` namespace)
To summarise, we need to use `http://ingress-nginx.ingress-nginx.svc.cluster.local`

We can also use ExternalName service to enable us to use short name:
![external name service](images/external-name-service.png)

## Other resources

1. [Cookie content decoder](https://www.base64decode.org)
2. [JWT decoder](https://jwt.io)
