---
title: Todos & Possession
---

Actuellement, l'API renvoie les todos de chacun à chaque utilisateur. Ce n'est pas le comportement attendu. Nous aimerions que chaque utilisateur n'ait accès qu'à ses tâches.

Retournez à l'`ApiController` et mettez à jour la route `getTodos`.

```typescript
  @Get('/todos')
  async getTodos(ctx: Context) {
    const todos = await Todo.find({ owner: ctx.user });
    return new HttpResponseOK(todos);
  }
```

> L'objet `Context` contient quatre propriétés :
> - l'objet [requête d'Express](https://expressjs.com/en/4x/api.html#req),
> - un objet vide appelé `state` qui peut être utilisé pour partager des données entre les hooks, 
> - un objet `session`,
> - et l'objet `user` qui est défini si un utilisateur se connecte.

Rafraîchissez la page todo-list. Vous ne devriez voir que les todos de l'utilisateur avec lequel vous vous êtes connecté.

Cependant, si vous essayez de créer une nouvelle tâche, elle disparaîtra lors du rafraîchissement de la page. Ceci est parfaitement normal puisque nous ne spécifions pas son propriétaire lors de la création.

Quant à la fonction de suppression, vous devez également en restreindre l'accès. Les utilisateurs ne devraient pouvoir supprimer que leurs tâches.

Mettez à jour le contrôleur de l'API.

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

L'application fonctionne maintenant correctement.
