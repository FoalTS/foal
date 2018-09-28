# Introduction

The application that you will create is a simple to-do list. It consists of a frontend part that has already been written for you and a backend part that will be the topic of this tutorial.

First download the html, css and js files by clicking [here]().

Put the static files `script.js` and `style.js` in `public/` and move the `index.html` template in `src/app/controllers/templates/`.

> The code executed in the browser will make API calls to view, create and delete the tasks. The only reason why `index.html` is a template is to send the [CSRF token](https://en.wikipedia.org/wiki/Cross-site_request_forgery) to the frontend.

Stop and restart the `npm run develop` command and go to `http://localhost:3000`. You should now see this:

![Browser view]()

As you haven't implemented yet the server API, the frontend gets an error when fetching the to-dos. It is displayed in the bottom of the page. If you try to type something in the text input and press Enter to create a new task, you'll get an error as well.

Let's see the details of the API we want to build.

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