# Todos & Ownership

> You are reading the documentation for version 2 of FoalTS. The documentation for version 1 can be found [here](#). To migrate to version 2, follow [this guide](../upgrade-to-v2/index.md).


Currently the API returns everyone's todos to each user. This is not the expected behavior. We would like that each user has access to only his or her tasks.

Go back to the `ApiController` and update the `getTodos` route.

```typescript
  @Get('/todos')
  async getTodos(ctx: Context) {
    const todos = await Todo.find({ owner: ctx.user });
    return new HttpResponseOK(todos);
  }
```

> The `Context` object contains four properties:
> - the express [request object](https://expressjs.com/en/4x/api.html#req),
> - an empty object called `state` which can be used to share data between hooks, 
> - a `session` object,
> - and the `user` object that is defined if a user logged in.

Refresh the todo-list page. You should only see the todos of the user with whom you logged in.

Yet, if you try to create a new to-do, it will disappear upon page refresh. This is perfectly normal since we do not specify its owner upon creation.

As for the delete feature, you also need to restrict its access. Users should only be able to delete their todos.

Update the api controller.

```typescript
  @Post('/todos')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      text: { type: 'string' }
    },
    required: [ 'text' ],
    type: 'object',
  })
  async postTodo(ctx: Context) {
    const todo = new Todo();
    todo.text = ctx.request.body.text;
    // Make the current user the owner of the todo.
    todo.owner = ctx.user;

    await todo.save()

    return new HttpResponseCreated(todo);
  }

  @Delete('/todos/:id')
  @ValidatePathParam('id', { type: 'number' })
  async deleteTodo(ctx: Context) {
    const todo = await Todo.findOne({
      id: ctx.request.params.id,
      // Do not return the todo if it does not belong to the current user.
      owner: ctx.user
    });
    if (!todo) {
      return new HttpResponseNotFound();
    }
    await todo.remove()
    return new HttpResponseNoContent();
  }
```

The application is now working properly.
