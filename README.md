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

## Project setup

1. In **ticketing/auth/**:
   1. Run `npm init -y`
   2. Run `npm install typescript ts-node-dev express @types/express`
   3. Run `tsc --init` (this produces _tsconfig.json_)
   4. Replace the _"test": "xxxxx"_ script in package.json with _"start": "ts-node-dev src/index.ts"_
      ![Pic 1](images/packagejsondemo.png)
      ![Pic 2](images/packagejsondemo2.png)
   5. Then `run npm install` (this will runs the command _ts-node-dev src/index.ts_ when npm starts)
2. In **ticketing**:
   1. Run `skaffold dev` to start skaffold

![xxxx](images/xxxx.png)
