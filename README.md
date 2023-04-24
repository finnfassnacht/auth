# Securing Your Node.js Server Made Easy with IBM App ID
The IBM Cloud provides a wide array of tools and services, including App ID, which allows you to effortlessly incorporate authentication into your web applications. With App ID, you can easily specify who is authorized to access your application and which authentication service is required, such as Google or Facebook. Additionally, you can personalize the login page to suit your needs. In this blog post, we will demonstrate how to build a web application using Node.js and Express, and then secure it with IBM Cloud's App ID.

## Prerequisites:

1. You possess a fundamental understanding of server architecture, such as routes and their function within a web application.
2. You have a basic comprehension of Node.js and its role in web development.
3. You should know how to deploy an application to IBM Code Engine. If you don't, don't worry, check out [this tutorial]("")

## Creating the Web App
To begin, we will create a straightforward web application. Specifically, we'll construct a server that serves a static HTML website along with three routes, two of which necessitate authentication. The HTML site will have links to these routes.
```js
// use Express.js
const express = require('express'); 								
const app = express();
// serve static HTML
app.use(express.static('www'));

// secret route 
app.get("/secret/secret", (req, res) => {
    res.send("secret info here")
    res.end()
})
// another secret route
app.get("/secret/test", (req, res) => {
    res.send("some secret test,")
    res.end()
})
// non secret route 
app.get("/test", (req, res) => {
    res.send("some test, no secret route ")
    res.end()
})

// Start server on Port 8080
app.listen(8080, () => {
    console.log('Server is Running!!');
});
```

If you were to run this code, anyone would have access to all the routes. To address this, we'll implement authentication requirements to protect these routes and restrict access to authorized users only.

First, navigate to the IBM Cloud and set up your App ID service. This service will enable us to secure our web application and manage authentication requirements.

To do so, search for App ID in the IBM Cloud catalog. Choose a region (such as us-east) and a plan (such as Lite), and then click on the create button. This will create an App ID resource for you.
Create a User by selecting "Users" from the sidebar, followed by "Cloud Directory." Next, click on the "Create User" button, which will prompt you to enter information about the user you're creating. Once finished, click "Save" to add the user to your Cloud Directory.

## Add Authentication

