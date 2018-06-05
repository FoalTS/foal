# 1. Introduction

## What you'll build

This guide covers the basics of `FoalTS`. You will learn how to quickly build a web application using the core concepts of the framework.

For this example you are going to create an app that lists the airplanes at departure from a given airport. You will learn to:
- answer simple requests,
- create a model and a model service,
- serve a REST API,
- control input data,
- use hooks and services together,
- and test your components.

## Prerequities

Before going further you need to [create a new project](../README.md) if it is not already done. In this tutorial we are going to use SQLite as database because it does not require any installation.

Then [download the frontend code](https://foalts.org/guide-frontend.zip), unzip the bundle and paste all the files in the `public/` directory. You will only focus on the backend of the application in this tutorial.

At this point you should normally see the below interface at `http://localhost:3000`. If it is not, please check that `npm run develop` is running properly with no errors.

![App image](./app.png)

The interface displays some errors since you have not created the backend yet.