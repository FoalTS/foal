# Quick Start

This section explains how authentication and authorization are handled in FoalTS.

*Authorization*, also known as *Access Control*, is mediating access to resources on the basis of identity. It answers the question *What the user is allowed to do?*. In this way it differs from *authentication* which, upstream, answers the question *Who is the user?*.

FoalTS offers several ways to manage authentication and authorization based on your needs and the complexity of your application.

FoalTS provides two ways to manage authentication : Session Tokens & JWT.

Session Tokens: They are probably the easiest way to manage authentication with Foal. Expiration is automatically managed, revocation is easy. These tokens uses sessions. But don’t be scare, Foal solves common issues that appear with session in other frameworks. (SPA, serverless and scalability, hot reloading)

*src/app/app.controller.ts*
```typescript
import { controller } from '@foal/core';

export class AppController {
  subControllers = [
    AuthController,
    controller('/api', ApiController),
  ];
}
```

*src/app/entities/user.entity.ts*
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

## SPA + API / Mobile + API (no cookies)

-> Authorization header

### Sessions Tokens

*src/app/controllers/auth.controller.ts*
```typescript
import { dependency, Get, Post, ValidateBody } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
// ... to complete

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(user);
    return new HttpResponseOK({
      token: session.getToken()
    });
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    return new HttpResponseOK({
      token: session.getToken()
    });
  }

  @Get('/logout')
  async logout(ctx: Context) {
    await logOut(ctx, this.store);
    return new HttpResponseNoContent();
  }
}
```

*src/app/controllers/api.controller.ts*
```typescript
@TokenRequired({ store: TypeORMStore })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

### JSON Web Tokens

*src/app/controllers/auth.controller.ts*
```typescript
const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    return this.generateLoginResponse(user);
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    return this.generateLoginResponse(user);
  }

  private async generateLoginResponse(user: User): Promise<HttpResponseOK> {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const secret = Config.get<string>('settings.jwt.secretOrPublicKey');

    const token = await new Promise<string>((resolve, reject) => {
      sign(payload, secret, { subject: user.id.toString() }, (err, value: string) => {
        if (err) {
          return reject(err);
        }
        resolve(value);
      });
    });

    return new HttpResponseOK({
      token
    });
  }
}
```

*src/app/controllers/api.controller.ts*
```typescript
@JWTRequired()
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

## SPA + API (with cookies)

Session Tokens.
CLI Angular
Mention CSRF

### Session Tokens

*src/app/controllers/auth.controller.ts*
```typescript
const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseNoContent();
    setSessionCookie(response, session);
    return response;
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseNoContent();
    setSessionCookie(response, session);
    return response;
  }

  @Get('/logout')
  async logout(ctx) {
    await logOut(ctx, this.store, { cookie: true });
    const response = new HttpResponseNoContent();
    removeSessionCookie(response);
    return response;
  }
}
```

*src/app/controllers/api.controller.ts*
```typescript
@TokenRequired({ store: TypeORMStore, cookie: true })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

## Regular Web Applications (with cookies and redirections)

SSR & templates
Session Tokens
Mention CSRF

*src/app/app.controller.ts*
```typescript
import { controller } from '@foal/core';

export class AppController {
  subControllers = [
    AuthController,
    ViewController,
    controller('/api', ApiController),
  ];
}
```

*src/app/controllers/auth.controller.ts*
```typescript
const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseRedirect('/home');
    setSessionCookie(response, session);
    return response;
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login');
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseRedirect('/home');
    setSessionCookie(response, session);
    return response;
  }

  @Get('/logout')
  async logout(ctx: Context) {
    await logOut(ctx, this.store, { cookie: true });
    const response = new HttpResponseRedirect('/login');
    removeSessionCookie(response);
    return response;
  }
}
```

*src/app/controllers/view.controller.ts*
```typescript
export class ViewController {
  @Get('/home')
  @TokenRequired({ store: TypeORMStore, cookie: true, redirectTo: '/login' })
  home() {
    return new HttpResponseOK('Home page');
  }
}
```

*src/app/controllers/api.controller.ts*
```typescript
@TokenRequired({ store: TypeORMStore, cookie: true })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```