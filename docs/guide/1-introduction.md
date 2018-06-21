# 1. Introduction

This tutorial will teach you how to create a web app using the core concepts of FoalTS. Through this you are going to create a board to manage the flights departing from the JFK airport. You'll be able to display the name of the airport, list the flights and add or remove some.

As most of nowdays apps use rich-client interface, you'll use a precompiled frontend app made with Angular and Bootstrap. Note that you don't need to use Angular as frontend framework to use FoalTS. You can use whatever client technology you feel confortable with (angular, vue, react, mobile app, etc). This tutorial though will use a prepared bundle to handle the client-side as frontend development is out of the scope of this guide.

First create a new project by following [these instructions](../README.md).

Then [download the frontend app](https://foalts.org/guide-frontend.zip), unzip the bundle and replace the `public/` directory and the `src/app/templates/index.html` template with the downloaded files.

If you refresh the page at `http://localhost:3000` you should now see this.

> If the server is not running, enter the command `npm run develop` in your console/terminal.

![App image](./app.png)

> Some errors should show up in the page. This is perfectly normal as we haven't implemented the backend API yet. If you try to add a flight you'll see another http error displaying.

Now that the front side is set up, let's see what requests should be handled by the server.

*Get the airport name*: `GET /airport` -> `{ "name": "JFK" }` (status: 200)

*Get all the flights*: `GET /flights` -> `[ { "id": 1, "destination": "CDG" }, { "id": 2, "destination": "CPH" } ]` (status 200)

*Add a new flight*: `POST /flights { "destination": "SFO" }` -> `{ "id": 3, "destination": "SFO" }` (status 201)

*Delete a flight*: `DELETE /flights/4` -> status 200 or status 404

Let's get started!
