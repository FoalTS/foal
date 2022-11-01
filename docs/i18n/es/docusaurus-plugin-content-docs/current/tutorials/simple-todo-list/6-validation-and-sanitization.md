---
title: Validación & Sanitización
id: tuto-6-validation-and-sanitization
slug: 6-validation-and-sanitization
---

Actualmente las entradas recibidas por el servidor no se comprueban. Todo el mundo puede enviar cualquier cosa al solicitar `POST /api/todos`. Por eso no se puede confiar en las entradas del cliente.

Utilizará los hooks `ValidateBody` y `ValidatePathParam` para validar y sanear los datos entrantes.

Un *hook* es un decorador que se adjunta a un gestor de rutas (un método del controlador). Se ejecuta antes del método y, por tanto, es especialmente adecuado para la validación o el control de acceso.

El `ValidateBody` y el `ValidatePathParam` comprueban respectivamente las propiedades `body` y `params` del objeto de petición. Toman un esquema como único argumento.

> FoalTS utiliza [Ajv](https://github.com/epoberezkin/ajv), un rápido validador de esquemas JSON, para definir sus esquemas.

Vamos a añadir validación y sanitización a su aplicación. De hecho, ya ha definido el esquema de tarea en el script `crear-todo` anterior.

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
