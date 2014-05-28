Cyber Career Fair
-----------------

##Intro

Since Houghton is in the middle of nowhere, we sometimes have a hard time getting companies to come up for career fair. 

Cyber Career Fair is a solution to this problem.

Using Cyber Career Fair, departments and organizations can gather groups of related companies and host career fairs from anywhere in the world.

MTU students can sign in with their MTU address, and register with companies. Each company participating can see the entries for each user that expresses an interest in them.

##Technical Details

MEAN Stack, Mongoose, Express, AngularJS, and Node. w/ Baucis for API.

###Models

All the models are defined in models/

This is a very data driven application. The four models used are _company_, _entry_, _event_, and _user_.

The top level object is an entry. Each entry contains a reference to the user that created it, the event is belongs to, and a list of companies the user is interested in.

###Static Assets

The application is very front end heavy, and most of that exist in public/js/app.js. It's a standard AngularJS app, I use ngResource to gather/modify the documents on the backend. Each resource is wrapped into a service, and each page has it's own controller. Looking at the router at the top of public/js/app.js should give a pretty good idea of how the application works.

###Routes

Baucis does most of the heavy lifting. I registered the four models with Baucis, and then defined some custom security middleware inside of routes/api.js. 

###User Authentication

Authentication is done through passport.js. Currently using google openID Sign-in. 

###App.js

Loads the static handler, and the routes. 

## Contact

sclarsen@mtu.edu