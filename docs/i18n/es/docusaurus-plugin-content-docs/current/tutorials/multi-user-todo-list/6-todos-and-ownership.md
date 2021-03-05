---
title: Tareas & Propriedad
---

Actualmente la API devuelve las tareas de cada usuario. Este no es el comportamiento esperado. Nos gustaría que cada usuario tuviera acceso sólo a sus tareas.

Vuelva al `ApiController` y actualice la ruta `getTodos`.

```typescript
  @Get('/todos')
  async getTodos(ctx: Context) {
    const todos = await Todo.find({ owner: ctx.user });
    return new HttpResponseOK(todos);
  }
```

> El objeto `Contexto` contiene cuatro propiedades:
> - el objeto [request](https://expressjs.com/es/4x/api.html#req) de Express,
> - un objeto vacío llamado `state` que puede utilizarse para compartir datos entre hooks, 
> - un objeto `session`,
> - y el objeto `user` que se define si un usuario se ha conectado.

Actualice la página de la lista de tareas. Sólo debería ver las tareas del usuario con el que ha iniciado la sesión.

Sin embargo, si intenta crear una nueva tarea pendiente, ésta desaparecerá al actualizar la página. Esto es perfectamente normal, ya que no se especifica su propietario en el momento de la creación.

En cuanto a la función de borrado, también hay que restringir su acceso. Los usuarios sólo deberían poder borrar sus tareas.

Actualice el controlador api.

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

    await todo.save();

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
    await todo.remove();
    return new HttpResponseNoContent();
  }
```

Ahora la aplicación funciona correctamente.
