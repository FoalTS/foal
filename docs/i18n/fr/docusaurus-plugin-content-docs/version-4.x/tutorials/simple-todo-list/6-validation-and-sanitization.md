---
title: Validation & Assainissement
id: tuto-6-validation-and-sanitization
slug: 6-validation-and-sanitization
---

Actuellement, les entrées reçues par le serveur ne sont pas vérifiées. Tout le monde peut envoyer n'importe quoi en lançant une requête à `POST /api/todos`. C'est pourquoi les entrées du client ne sont pas considérées comme fiables.

Vous utiliserez les *hooks* `ValidateBody` et `ValidatePathParam` pour valider et nettoyer les données entrantes.

Un *hook* est un décorateur qui est attaché à un gestionnaire de route (une méthode de contrôleur). Il est exécuté avant la méthode et est donc particulièrement adapté à la validation ou au contrôle d'accès.

Les méthodes `ValidateBody` et `ValidatePathParam` vérifient respectivement les propriétés `body` et `params` de l'objet de requête. Ils prennent un schéma comme argument unique.

> FoalTS utilise [Ajv](https://github.com/epoberezkin/ajv), un validateur de schéma JSON rapide, pour définir ses schémas.

Ajoutons la validation et l'assainissement à votre application. En fait, vous avez déjà défini le schéma todo dans le script `create-todo` plus tôt.

```typescript
import {
  ...
  ValidateBody, ValidatePathParam
} from '@foal/core';

export class ApiController {

  ...

  @Post('/todos')
  @ValidateBody({
    // Every additional properties that are not defined in the "properties"
    // object should be removed.
    additionalProperties: false,
    properties: {
      // The "text" property of ctx.request.body should be a string if it exists.
      text: { type: 'string' }
    },
    // The property "text" is required.
    required: [ 'text' ],
    // The body request should be an object once parsed by the framework.
    type: 'object',
  })
  async postTodo(ctx: Context) {
    const todo = new Todo();
    todo.text = ctx.request.body.text;

    await todo.save();

    return new HttpResponseCreated(todo);
  }

  @Delete('/todos/:id')
  // The id should be a number. If it is not, the hook returns a "400 - Bad Request" error.
  @ValidatePathParam('id', { type: 'number' })
  async deleteTodo(ctx: Context) {
    const todo = await Todo.findOneBy({ id: ctx.request.params.id });
    if (!todo) {
      return new HttpResponseNotFound();
    }
    await todo.remove();
    return new HttpResponseNoContent();
  }

}

```
