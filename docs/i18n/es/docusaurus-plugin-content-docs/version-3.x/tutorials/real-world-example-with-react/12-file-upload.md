---
title: Carga y Descarga de Imágenes
id: tuto-12-file-upload
slug: 12-file-upload
---

El siguiente paso en este tutorial es permitir a los usuarios subir una imagen de perfil. Esta imagen se mostrará en la página de inicio delante de cada publicación de cada autor.

Para ello, utilizará el sistema de almacenamiento de Foal. Éste le permite validar y guardar los archivos subidos por el cliente. Estos archivos pueden guardarse en su unidad local o en la nube utilizando AWS S3. No utilizaremos la función de la nube en este tutorial, pero puede encontrar cómo configurarla [aquí](../../common/file-storage/local-and-cloud-storage.md).

## Lado del servidor

Primero, instale el paquete. 

```bash
npm install @foal/storage
```

Actualice la configuración en `config/default.json` para especificar la ubicación de los archivos a los que puede acceder el gestor de disco.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "disk": {
      "local": {
        "directory": "assets"
      }
    }
  },
  ...
}
```

A continuación, cree el directorio `assets/images/profiles/uploaded` donde se cargarán las imágenes de perfil. Descargue la imagen de perfil por defecto [aquí](./assets/default.png) y colóquela en la carpeta `assets/images/profiles` con el nombre `default.png`.

Ya está listo para crear el controlador. Genere uno nuevo.

```bash
foal generate controller api/profile --register
```

Abra el nuevo archivo `profile.controller.ts` y añada dos nuevas rutas.

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/profile/avatar` | `GET` | Recupera la imagen del perfil del usuario. Si se proporciona el parámetro de consulta opcional `userId`, el servidor devuelve el avatar de ese usuario. En caso contrario, devuelve el avatar del usuario actual. Si ningún usuario está autenticado o no tiene imagen de perfil, se devuelve una imagen por defecto. |
| `/api/profile` | `POST` | Actualiza el perfil del usuario. Se espera un campo `name` y un archivo opcional `avatar`. |

```typescript
import { Context, dependency, File, Get, HttpResponseNoContent, Post, UserRequired, ValidateQueryParam } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { User } from '../../entities';

export class ProfileController {
  @dependency
  disk: Disk;

  @Get('/avatar')
  @ValidateQueryParam('userId', { type: 'number' }, { required: false })
  async readProfileImage(ctx: Context<User|null>) {
    let user = ctx.user;

    const userId: number|undefined = ctx.request.query.userId;
    if (userId !== undefined) {
      user = await User.findOneBy({ id: userId })
    }

    if (!user || !user.avatar) {
      return this.disk.createHttpResponse('images/profiles/default.png');
    }

    return this.disk.createHttpResponse(user.avatar);
  }

  @Post()
  @UserRequired()
  @ParseAndValidateFiles(
    {
      avatar: { required: false, saveTo: 'images/profiles/uploaded' }
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 255 }
      },
      required: ['name']
    }
  )
  async updateProfileImage(ctx: Context<User>) {
    ctx.user.name = ctx.request.body.name;

    // Warning: File must be imported from `@foal/core`.
    const file: File|undefined = ctx.files.get('avatar')[0];
    if (file) {
      if (ctx.user.avatar) {
        await this.disk.delete(ctx.user.avatar);
      }
      ctx.user.avatar = file.path;
    }

    await ctx.user.save();

    return new HttpResponseNoContent();
  }

}

```

Vaya a [http://localhost:3001/swagger](http://localhost:3001/swagger) e intente subir una foto de perfil. Primero debe iniciar la sesión.

> Puede que haya notado el decorador `@dependency` para establecer la propiedad `disk: Disk`. Este mecanismo se llama inyección de dependencia y es particularmente útil en las pruebas unitarias. Puede leer más sobre ello [aquí](../../architecture/architecture-overview.md)

## Lado del cliente

En el lado del cliente, la descarga de la imagen del perfil se gestiona en los archivos `ProfileHeader.tsx` y `requests/profile.ts`.

Abra este último e implemente la función `updateProfile`.

```typescript
import axios from 'axios';

export async function updateProfile(username: string, avatar: File|null): Promise<void> {
  const formData = new FormData();
  formData.set('name', username);
  if (avatar) {
    formData.set('avatar', avatar);
  }

  await axios.post('/api/profile', formData, {
    headers: {
    'content-type': 'multipart/form-data'
    }
  });
}
```

Ahora, si vuelve a [http://localhost:3000/profile](http://localhost:3000/profile), debería poder subir su foto de perfil.