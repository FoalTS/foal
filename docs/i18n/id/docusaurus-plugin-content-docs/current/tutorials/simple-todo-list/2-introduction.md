---
title: Introduction
id: tuto-2-introduction
slug: 2-introduction
---

The application that you will create is a simple to-do list. It consists of a frontend part that has already been written for you and a backend part that will be the topic of this tutorial.

First download the html, css and js files by clicking [here](https://foalts.org/simple-todo-list.zip).

Put the downloaded, unzipped files in the static directory `public/`.

The code executed in the browser will make API calls to the server to view, create and delete the tasks.

Refresh the page. You should now see this:

![Browser view](./app.png)

> As you haven&#8217;t yet implemented the server API, the frontend gets an error when fetching the to-dos. It is displayed at the bottom of the page. If you try to type something in the text input and press Enter to create a new task, you&#8217;ll get an error as well.

Let&#8217;s see the details of the API we want to build.

**List the tasks**
- Request:
  - method: `GET`
  - path: `/api/todos`
- Response:
  - status: 200 (OK)
  - body: 
    ```json
    [
      { "id": 1, "text": "Task 1" },
      { "id": 2, "text": "Task 2" },
    ]
    ```

**Create a task**
- Request:
  - method: `POST`
  - path: `/api/todos`
  - body:
    ```json
    {
      "text": "Task 3"
    }
    ```
- Response:
  - status: 201 (Created)
  - body: 
    ```json
    {
      "id": 3,
      "text": "Task 3"
    }
    ```

**Delete a task**
- Request:
  - method: `DELETE`
  - path: `/api/todos/3`
- Response:
  - status: 204 (No Content)
