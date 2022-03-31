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

### Database storage

We need storage to store User, Ticket, Order, Charge.
![Objects for storage](images/Objects4Storage.png)

### Services

![Services](images/Services.png)

### Events

![Events](images/Events.png)

### Auth Service Apis

![Auth APIs](images/AuthAPIs.png)

Currently Auth Service is listening at **port 3000**

### Technologies used

1. Next.js: server side rendering React framework.
2. MongoDB
3. Redis
4. NATS streaming server

### Error handlings

![Error handling methods](images/error-handlings.png)

Express error handling: https://expressjs.com/en/guide/error-handling.html

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
2. In **ticketing**:
   1. Run `skaffold dev` to start skaffold

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

## Debug

### Error 1:

```
build [us.gcr.io/ticketing-dev-345514/auth] failed: getting cloudbuild client: google: could not find default credentials. See https://developers.google.com/accounts/docs/application-default-credentials for more information.
```

Resolved url: https://stackoverflow.com/questions/41507904/could-not-find-default-credentials

Summary: Run this command `gcloud auth application-default login`
