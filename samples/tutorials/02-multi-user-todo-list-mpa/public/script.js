function request(url, method, body) {
  return fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (!response.ok) {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
        method,
        url: response.url
      });
    }
    
    return response.json().catch(() => {});
  });
}

const app = new Vue({
  el: '#app',
  data: {
    newTodoText: '',
    todos: [
      // {
      //   id: 1,
      //   text: 'Donald Duck'
      // }
    ],
    error: null
  },
  methods: {
    addNewTodo: function () {
      if (!this.newTodoText) { return; }

      this.error = null;
      request('/api/todos', 'POST', { text: this.newTodoText })
        .then(todo => this.todos.push(todo))
        .catch(error => this.error = error);
      
      this.newTodoText = '';
    },
    deleteTodo: function (todo, event) {
      if (event) event.preventDefault()

      this.error = null;
      request('/api/todos/' + todo.id, 'DELETE')
        .then(() => {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
        })
        .catch(error => {
          this.error = error;
        });
    }
  }
});

app.error = null;
request('/api/todos', 'GET')
  .then(todos => app.todos = todos)
  .catch(error => app.error = error);