"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8618],{1500:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var i=t(74848),r=t(28453);const s={title:"Authentication with JWT",sidebar_label:"JSON Web Tokens (authentication)"},o="Generate & Provide a Secret",c={id:"authentication-and-access-control/jwt",title:"Authentication with JWT",description:"JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.",source:"@site/versioned_docs/version-1.x/authentication-and-access-control/jwt.md",sourceDirName:"authentication-and-access-control",slug:"/authentication-and-access-control/jwt",permalink:"/es/docs/1.x/authentication-and-access-control/jwt",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-1.x/authentication-and-access-control/jwt.md",tags:[],version:"1.x",frontMatter:{title:"Authentication with JWT",sidebar_label:"JSON Web Tokens (authentication)"},sidebar:"someSidebar",previous:{title:"Session Tokens (authentication)",permalink:"/es/docs/1.x/authentication-and-access-control/session-tokens"},next:{title:"Social Auth",permalink:"/es/docs/1.x/authentication-and-access-control/social-auth"}},a={},d=[{value:"Example of a <code>LoginController</code>",id:"example-of-a-logincontroller",level:2},{value:"Blacklist Tokens",id:"blacklist-tokens",level:2},{value:"Refresh the tokens",id:"refresh-the-tokens",level:2},{value:"Make a Database Call to Get More User Properties",id:"make-a-database-call-to-get-more-user-properties",level:2},{value:"Specifying a Different Encoding for Secrets",id:"specifying-a-different-encoding-for-secrets",level:2},{value:"Store JWTs in a cookie",id:"store-jwts-in-a-cookie",level:2},{value:"Use RSA or ECDSA public/private keys",id:"use-rsa-or-ecdsa-publicprivate-keys",level:2},{value:"Provide the Public/Private Key",id:"provide-the-publicprivate-key",level:3},{value:"Generate Temporary Tokens",id:"generate-temporary-tokens",level:3},{value:"Receive &amp; Verify Tokens",id:"receive--verify-tokens-1",level:3},{value:"Audience, Issuer and Other Options",id:"audience-issuer-and-other-options",level:2},{value:"Retreive a Dynamic Secret Or Public Key",id:"retreive-a-dynamic-secret-or-public-key",level:2},{value:"Retreive a Public Key from a JWKS endpoint",id:"retreive-a-public-key-from-a-jwks-endpoint",level:3},{value:"Auth0 and AWS Cognito (examples)",id:"auth0-and-aws-cognito-examples",level:2}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"npm install jsonwebtoken @foal/jwt\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA."})}),"\n",(0,i.jsxs)(n.p,{children:["Source: ",(0,i.jsx)(n.a,{href:"https://jwt.io/introduction/",children:"https://jwt.io/introduction/"})]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Foal offers a package, named ",(0,i.jsx)(n.code,{children:"@foal/jwt"}),", to manage authentication / authorization with JSON Web Tokens. When the user logs in, a token is generated and sent to the client. Then, each subsequent request must include this JWT, allowing the user to access routes, services, and resources that are permitted with that token."]}),"\n",(0,i.jsx)(n.h1,{id:"generate--provide-a-secret",children:"Generate & Provide a Secret"}),"\n",(0,i.jsxs)(n.p,{children:["In order to use JWTs, you must provide a secret to ",(0,i.jsx)(n.em,{children:"sign"})," your tokens. If you do not already have your own, you can generate one with the ",(0,i.jsx)(n.code,{children:"foal createsecret"})," command."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-sh",children:"$ foal createsecret\nAk0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Alternatively you can use a public/private key pair to sign your tokens. In this case, please refer to the ",(0,i.jsx)(n.a,{href:"#Use-RSA-or-ECDSA-public/private-keys",children:"advanced section"})," below."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Once the secret is in hand, there are several ways to provide it to the future hooks:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["using the environment variable ",(0,i.jsx)(n.code,{children:"SETTINGS_JWT_SECRET_OR_PUBLIC_KEY"}),","]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["in a file named ",(0,i.jsx)(n.code,{children:".env"})," in the root directory,"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["or in a YAML or JSON file in the ",(0,i.jsx)(n.code,{children:"config/"})," directory."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"development.yml"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'settings:\n  jwt:\n    secretOrPublicKey: "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="\n'})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"development.json"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "settings": {\n    "jwt": {\n      "secretOrPublicKey": "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="\n    }\n  }\n}\n'})}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"Note that if the production secret is stored in a file, this file should not be committed."}),"\n"]}),"\n",(0,i.jsx)(n.h1,{id:"generate--send-temporary-tokens",children:"Generate & Send Temporary Tokens"}),"\n",(0,i.jsx)(n.p,{children:"JSON Web Tokens are generated from JavaScript objects that usually contain information about the user."}),"\n",(0,i.jsx)(n.p,{children:"The below example shows how to generate a one-hour token using a secret."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Config } from '@foal/core';\nimport { sign } from 'jsonwebtoken';\n\nconst token = sign(\n  {\n    sub: '90485234',\n    id: 90485234,\n    email: 'mary@foalts.org'\n  },\n  Config.get<string>('settings.jwt.secretOrPublicKey'),\n  { expiresIn: '1h' }\n);\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"subject"})," property (or ",(0,i.jsx)(n.code,{children:"sub"}),") is only required when ",(0,i.jsx)(n.a,{href:"#Make-a-Database-Call-to-Get-More-User-Properties",children:"making a database call to get more user properties"}),"."]}),"\n",(0,i.jsx)(n.li,{children:"Each token should have an expiration time. Otherwise, the JWT will be valid indefinitely, which will raise security issues."}),"\n"]}),"\n",(0,i.jsxs)(n.h2,{id:"example-of-a-logincontroller",children:["Example of a ",(0,i.jsx)(n.code,{children:"LoginController"})]}),"\n",(0,i.jsx)(n.p,{children:"The below example shows how to implement a login controller with an email and a password."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"login.controller.ts"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import {\n  Config, Context, HttpResponseOK, HttpResponseUnauthorized,\n  Post, ValidateBody, verifyPassword\n} from '@foal/core';\nimport { sign } from 'jsonwebtoken';\n\nimport { User } from '../entities';\n\nexport class LoginController {\n\n  @Post('/login')\n  @ValidateBody({\n    additionalProperties: false,\n    properties: {\n      email: { type: 'string', format: 'email' },\n      password: { type: 'string' }\n    },\n    required: [ 'email', 'password' ],\n    type: 'object',\n  })\n  async login(ctx: Context) {\n    const user = await User.findOne({ email: ctx.request.body.email });\n\n    if (!user) {\n      return new HttpResponseUnauthorized();\n    }\n\n    if (!await verifyPassword(ctx.request.body.password, user.password)) {\n      return new HttpResponseUnauthorized();\n    }\n\n    const token = sign(\n      { email: user.email },\n      Config.get<string>('settings.jwt.secretOrPublicKey'),\n      { expiresIn: '1h' }\n    );\n\n    return new HttpResponseOK({ token });\n  }\n\n}\n\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"user.entity.ts"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { hashPassword } from '@foal/core';\nimport { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class User extends BaseEntity {\n\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column({ unique: true })\n  email: string;\n\n  @Column()\n  password: string;\n\n  async setPassword(password: string) {\n    this.password = await hashPassword(password);\n  }\n\n}\n\n"})}),"\n",(0,i.jsx)(n.h1,{id:"receive--verify-tokens",children:"Receive & Verify Tokens"}),"\n",(0,i.jsxs)(n.p,{children:["Foal provides two hooks to authenticate users upon subsequent requests: ",(0,i.jsx)(n.code,{children:"JWTOptional"})," and ",(0,i.jsx)(n.code,{children:"JWTRequired"}),". They both expect the client to send the JWT in the ",(0,i.jsx)(n.strong,{children:"Authorization"})," header using the ",(0,i.jsx)(n.strong,{children:"Bearer"})," schema."]}),"\n",(0,i.jsx)(n.p,{children:"In other words, the content of the header should look like the following:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"Authorization: Bearer <token>\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If no token is provided, the ",(0,i.jsx)(n.code,{children:"JWTRequired"})," hook returns an error ",(0,i.jsx)(n.em,{children:"400 - BAD REQUEST"})," while ",(0,i.jsx)(n.code,{children:"JWTOptional"})," does nothing."]}),"\n",(0,i.jsxs)(n.p,{children:["If a token is provided and valid, the hooks set the ",(0,i.jsx)(n.code,{children:"Context.user"})," with the decoded payload (default behavior)."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Context, Get, HttpResponseOK } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\n\n@JWTRequired()\nexport class ApiController {\n\n  @Get('/products')\n  readProducts(ctx: Context) {\n    console.log(ctx.user);\n    return new HttpResponseOK([]);\n  }\n\n}\n"})}),"\n",(0,i.jsx)(n.h1,{id:"advanced",children:"Advanced"}),"\n",(0,i.jsx)(n.h2,{id:"blacklist-tokens",children:"Blacklist Tokens"}),"\n",(0,i.jsxs)(n.p,{children:["In the event that a jwt has been stolen by an attacker, the application must be able to revoke the compromised token. This can be done by establishing a ",(0,i.jsx)(n.em,{children:"black list"}),". Revoked tokens are no longer considered valid and the hooks return a 401 error - UNAUTHORIZED when they receive one."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { isInFile } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({ blackList: isInFile('./blacklist.txt') })\nexport class ApiController {\n  // ...\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"isInFile"})," function takes a token and returns a boolean specifying if the token is revoked or not."]}),"\n",(0,i.jsx)(n.p,{children:"You can provide your own function (in the case you want to use a cache database for example). This function must have this signature:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"(token: string) => boolean|Promise<boolean>;\n"})}),"\n",(0,i.jsx)(n.h2,{id:"refresh-the-tokens",children:"Refresh the tokens"}),"\n",(0,i.jsx)(n.p,{children:"Having a too-long expiration date for JSON Web Tokens is not recommend as it increases exposure to attacks based on token hijacking. If an attacker succeeds in stealing a token with an insufficient expiration date, he/she will have plenty of time to make other attacks and harm your application."}),"\n",(0,i.jsx)(n.p,{children:"In order to minimize the exposure, it is recommend to set a short expiration date (15 minutes for common applications) to quickly invalidate tokens. In this way, even if a token is stolen, it will quickly become unusable since it will have expired."}),"\n",(0,i.jsx)(n.p,{children:"One of the disadvantages of having short expiration dates, however, is that users get logged out too often which is not very user-friendly."}),"\n",(0,i.jsx)(n.p,{children:"One way to get around this problem is to generate and send a new token on each request. The client then saves this new token and uses it on further requests. In this way, if users are inactive more than 15 minutes, they are disconnected. Otherwise, the user will still be connected but the application will use a different token."}),"\n",(0,i.jsxs)(n.p,{children:["The below code shows how to implement this technique with a hook. On each request, the client will receive a new token in the ",(0,i.jsx)(n.code,{children:"Authorization"})," header of the response. Other implementations are still possible (especially if you use cookies)."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Note that when a new token is generated, the previous one is still valid until its expiration date."})}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"refresh-jwt.hook.ts (example)"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Config, Hook, HookDecorator, HttpResponse } from '@foal/core';\nimport { sign } from 'jsonwebtoken';\n\nexport function RefreshJWT(): HookDecorator {\n  return Hook(ctx => {\n    if (!ctx.user) {\n      return;\n    }\n\n    return (response: HttpResponse) => {\n      const newToken = sign(\n        // The below object assumes that ctx.user is\n        // the decoded payload (default behavior).\n        {\n          email: ctx.user.email,\n          // id: ctx.user.id,\n          // sub: ctx.user.subject,\n        },\n        Config.get<string>('settings.jwt.secretOrPublicKey'),\n        { expiresIn: '15m' }\n      );\n      response.setHeader('Authorization', newToken);\n    };\n\n  });\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"api.controller.ts (example)"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"@JWTRequired()\n@RefreshJWT()\nexport class ApiController {\n  // ...\n}\n"})}),"\n",(0,i.jsx)(n.h2,{id:"make-a-database-call-to-get-more-user-properties",children:"Make a Database Call to Get More User Properties"}),"\n",(0,i.jsxs)(n.p,{children:["In several cases, the decoded payload is not sufficient. We may need to fetch extra properties from the database, such as the user permissions for example, or simply want the ",(0,i.jsx)(n.code,{children:"Context.user"})," to a be a model instance instead of a plain object."]}),"\n",(0,i.jsxs)(n.p,{children:["In these cases, the two hooks ",(0,i.jsx)(n.code,{children:"JWTRequired"})," and ",(0,i.jsx)(n.code,{children:"JWTOptional"})," offer a ",(0,i.jsx)(n.code,{children:"user"})," option to transform the decoded payload into something else. To do this,"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Each JSON Web Token must have a ",(0,i.jsx)(n.code,{children:"subject"})," property (or ",(0,i.jsx)(n.code,{children:"sub"}),") which is a string containing the user id. If the id is a number, it must be converted to a string using, for example, the ",(0,i.jsx)(n.code,{children:"toString()"})," method."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Config } from '@foal/core';\nimport { sign } from 'jsonwebtoken';\n\nconst token = sign(\n  {\n    // TypeScript v3.5.1 and v3.5.2 have a bug which makes the compilation fail\n    // with the property \"sub\". This can be fixed by adding \"as any\" after the object.\n    sub: '90485234', // Required\n    id: 90485234,\n    email: 'mary@foalts.org'\n  },\n  Config.get<string>('settings.jwt.secretOrPublicKey'),\n  { expiresIn: '1h' }\n);\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["The hook must be provided a function that takes a string id (the ",(0,i.jsx)(n.code,{children:"subject"}),") as parameter and returns the value of the ",(0,i.jsx)(n.code,{children:"Context.user"}),". If the function returns ",(0,i.jsx)(n.code,{children:"undefined"}),", the hooks returns an error ",(0,i.jsx)(n.em,{children:"401 - UNAUTHORIZED"}),"."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example with TypeORM"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Context, Get } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\nimport { fetchUser } from '@foal/typeorm';\n\nimport { User } from '../entities';\n\n// fetchUser fetches the user from the database using the entity User. It returns an instance of User.\n@JWTRequired({ user: fetchUser(User) })\nexport class ApiController {\n  @Get('/do-something')\n  get(ctx: Context) {\n    // ctx.user is the instance returned by fetchUser.\n    // ...\n  }\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example with Mongoose"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Context, Get } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\nimport { fetchUser } from '@foal/mongoose';\n\nimport { User } from '../models';\n\n// fetchUser fetches the user from the database using the model User. It returns an instance of User.\n@JWTRequired({ user: fetchUser(User) })\nexport class ApiController {\n  @Get('/do-something')\n  get(ctx: Context) {\n    // ctx.user is the instance returned by fetchUser.\n    // ...\n  }\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example with a custom function"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Context, Get } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\n\nconst users = [\n  { id: 1, email: 'mary@foalts.org', isAdmin: true },\n  { id: 2, email: 'john@foalts.org', isAdmin: false },\n];\n\nfunction getUserById(id: string) {\n  return users.find(user => user.id.toString() === id);\n}\n\n@JWTRequired({ user: getUserById })\nexport class ApiController {\n  @Get('/do-something')\n  get(ctx: Context) {\n    // ctx.user is an item of the `users` array.\n    // ...\n  }\n}\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"specifying-a-different-encoding-for-secrets",children:"Specifying a Different Encoding for Secrets"}),"\n",(0,i.jsxs)(n.p,{children:["By default, UTF-8 is used to encode the secret string into bytes when verifying the token. However, you can use another character encoding with the ",(0,i.jsx)(n.code,{children:"settings.jwt.secretEncoding"})," configuration key."]}),"\n",(0,i.jsxs)(n.p,{children:["Available encodings are listed ",(0,i.jsx)(n.a,{href:"https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings",children:"here"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "settings": {\n    "jwt": {\n      "secretOrPublicKey": "HEwh0TW7w6a5yUwIrpHilUqetAqTFAVSHx2rg6DWNtg=",\n      "secretEncoding": "base64",\n    }\n  }\n}\n'})}),"\n",(0,i.jsx)(n.h2,{id:"store-jwts-in-a-cookie",children:"Store JWTs in a cookie"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Be aware that if you use cookies, your application must provide a ",(0,i.jsx)(n.a,{href:"/es/docs/1.x/security/csrf-protection",children:"CSRF defense"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["By default, the hooks expect the token to be sent in the ",(0,i.jsx)(n.strong,{children:"Authorization"})," header using the ",(0,i.jsx)(n.strong,{children:"Bearer"})," schema. But it is also possible to send the token in a cookie with the ",(0,i.jsx)(n.code,{children:"cookie"})," option."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({ cookie: true })\nexport class ApiController {\n  // ...\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["In this case, the token must be sent in a cookie named ",(0,i.jsx)(n.code,{children:"auth"})," by default. This name can be changed with the configuration key ",(0,i.jsx)(n.code,{children:"settings.jwt.cookieName"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["using the environment variable ",(0,i.jsx)(n.code,{children:"SETTINGS_JWT_COOKIE_NAME"}),","]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["in a file named ",(0,i.jsx)(n.code,{children:".env"})," in the root directory,"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"SETTINGS_JWT_COOKIE_NAME=custom_name\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["or in a YAML or JSON file in the ",(0,i.jsx)(n.code,{children:"config/"})," directory."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"development.yml"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'settings:\n  jwt:\n    cookieName: "custom_name"\n'})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"development.json"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "settings": {\n    "jwt": {\n      "cookieName": "custom_name"\n    }\n  }\n}\n'})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"use-rsa-or-ecdsa-publicprivate-keys",children:"Use RSA or ECDSA public/private keys"}),"\n",(0,i.jsx)(n.p,{children:"JWTs can also be signed using a public/private key pair using RSA or ECDSA."}),"\n",(0,i.jsx)(n.h3,{id:"provide-the-publicprivate-key",children:"Provide the Public/Private Key"}),"\n",(0,i.jsx)(n.p,{children:"The name of the private key is arbitrary."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsxs)(n.em,{children:["Example with a ",(0,i.jsx)(n.code,{children:".env"})," file"]})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=my_public_key\nJWT_PRIVATE_KEY=my_private_key\n"})}),"\n",(0,i.jsx)(n.h3,{id:"generate-temporary-tokens",children:"Generate Temporary Tokens"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { Config } from '@foal/core';\nimport { sign } from 'jsonwebtoken';\n\nconst token = sign(\n  {\n    email: 'john@foalts.org'\n  },\n  Config.get<string>('jwt.privateKey'),\n  { expiresIn: '1h' }\n);\n"})}),"\n",(0,i.jsx)(n.h3,{id:"receive--verify-tokens-1",children:"Receive & Verify Tokens"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example with RSA"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({}, { algorithm: 'RSA' })\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsx)(n.h2,{id:"audience-issuer-and-other-options",children:"Audience, Issuer and Other Options"}),"\n",(0,i.jsxs)(n.p,{children:["The second parameter of ",(0,i.jsx)(n.code,{children:"JWTOptional"})," and ",(0,i.jsx)(n.code,{children:"JWTRequired"})," allows to specify the required audience or issuer as well as other properties. It is passed as options to the ",(0,i.jsx)(n.code,{children:"verify"})," function of the ",(0,i.jsx)(n.a,{href:"https://www.npmjs.com/package/jsonwebtoken",children:"jsonwebtoken"})," library."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example checking the audience"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({}, { audience: [ /urn:f[o]{2}/, 'urn:bar' ] })\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example checking the issuer"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({}, { issuer: 'foo' })\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsx)(n.h2,{id:"retreive-a-dynamic-secret-or-public-key",children:"Retreive a Dynamic Secret Or Public Key"}),"\n",(0,i.jsxs)(n.p,{children:["By default ",(0,i.jsx)(n.code,{children:"JWTRequired"})," and ",(0,i.jsx)(n.code,{children:"JWTOptional"})," use the value of the configuration key ",(0,i.jsx)(n.code,{children:"settings.jwt.secretOrPublicKey"})," as a static secret (or public key)."]}),"\n",(0,i.jsxs)(n.p,{children:["But it is also possible to dynamically retrieve a key to verify the token. To do so, you can specify a function with the below signature to the ",(0,i.jsx)(n.code,{children:"secretOrPublicKey"})," option."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"(header: any, payload: any) => Promise<string>;\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({\n  secretOrPublicKey: async (header, payload) => {\n    // ...\n    return 'my-secret';\n  }\n})\nexport class ApiController {\n  // ...\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["If needed, this function can throw an ",(0,i.jsx)(n.code,{children:"InvalidTokenError"})," to return a 401 error to the client."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({\n  secretOrPublicKey: async (header, payload) => {\n    if (header.alg !== 'RS256') {\n      throw new InvalidTokenError('invalid algorithm');\n    }\n    return 'my-secret';\n  }\n})\nexport class ApiController {\n  // ...\n}\n"})}),"\n",(0,i.jsxs)(n.p,{children:["In the above example, if the algorithm specified in the token is not ",(0,i.jsx)(n.code,{children:"RS256"}),", then the server will respond a ",(0,i.jsx)(n.code,{children:"401 - UNAUTHORIZED"})," error with this content:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"{\n  code: 'invalid_token',\n  description: 'invalid algorithm'\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"retreive-a-public-key-from-a-jwks-endpoint",children:"Retreive a Public Key from a JWKS endpoint"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"npm install @foal/jwks-rsa\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"getRSAPublicKeyFromJWKS"})," allows you to retreive a public key from a JWKS endpoint. It is based on the ",(0,i.jsxs)(n.a,{href:"https://github.com/auth0/node-jwks-rsa",children:[(0,i.jsx)(n.code,{children:"jwks-rsa"})," library"]}),"."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Example"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n@JWTRequired({\n  secretOrPublicKey: getRSAPublicKeyFromJWKS({\n    cache: true,\n    cacheMaxEntries: 5, // Default value\n    cacheMaxAge: ms('10h'), // Default value\n    jwksUri: 'http://localhost:3000/.well-known/jwks.json',\n  })\n})\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsx)(n.h2,{id:"auth0-and-aws-cognito-examples",children:"Auth0 and AWS Cognito (examples)"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"npm install @foal/jwks-rsa\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"Auth0 & AWS Cognito are both platforms to manage authentication & authorization."}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["This section provides examples on how to decode and verify JWTs generated by these platforms (the ",(0,i.jsx)(n.code,{children:"id_token"}),"). It assumes that you are already familiar with them."]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Auth0"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n// These lines assume that you provided your DOMAIN and AUDIENCE in either\n// an .env file, in environment variables or in one the configuration file \n// in `config/`.\nconst domain = Config.get('auth0.domain');\nconst audience = Config.get('auth0.audience');\n\n@JWTRequired({\n  secretOrPublicKey: getRSAPublicKeyFromJWKS({\n    cache: true,\n    jwksRequestsPerMinute: 5,\n    jwksUri: `https://${domain}/.well-known/jwks.json`,\n    rateLimit: true,\n  })\n}, {\n  algorithms: [ 'RS256' ],\n  audience,\n  issuer: `https://${domain}/`,\n})\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"AWS Cognito"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-typescript",children:"import { JWTRequired } from '@foal/jwt';\n\n// These lines assume that you provided your CLIENT_ID, DOMAIN and USER_POOL_ID\n// in either an .env file, in environment variables or in one the configuration \n// file in `config/`.\nconst clientId = Config.get('cognito.clientId');\nconst domain = Config.get('cognito.domain');\nconst userPoolId = Config.get('cognito.userPoolId');\n\n@JWTRequired({\n  secretOrPublicKey: getRSAPublicKeyFromJWKS({\n    cache: true,\n    jwksRequestsPerMinute: 5,\n    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,\n    rateLimit: true,\n  })\n}, {\n  algorithms: [ 'RS256' ],\n  audience: clientId,\n  issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,\n})\nexport class ApiController {\n  // ...\n}\n\n"})}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.em,{children:"Note: The above example does not use a secret for simplicity."})}),"\n"]}),"\n",(0,i.jsx)(n.h1,{id:"hook-errors",children:"Hook Errors"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"Error"}),(0,i.jsx)(n.th,{children:"Response Status"}),(0,i.jsx)(n.th,{children:"Response Body"}),(0,i.jsxs)(n.th,{children:[(0,i.jsx)(n.code,{children:"WWW-Authenticate"})," Response Header"]})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["No secret or public key is provided in ",(0,i.jsx)(n.code,{children:"default.json"})," or as environment variable."]}),(0,i.jsx)(n.td,{children:"500"}),(0,i.jsx)(n.td,{}),(0,i.jsx)(n.td,{})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["The ",(0,i.jsx)(n.code,{children:"Authorization"})," header does not exist (only for ",(0,i.jsx)(n.code,{children:"JWTRequired"}),")."]}),(0,i.jsx)(n.td,{children:"400"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_request', description: 'Authorization header not found.' }"})}),(0,i.jsx)(n.td,{})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["The auth cookie does not exist (only for ",(0,i.jsx)(n.code,{children:"JWTRequired"}),")."]}),(0,i.jsx)(n.td,{children:"400"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_request', description: 'Auth cookie not found.' }"})}),(0,i.jsx)(n.td,{})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["The ",(0,i.jsx)(n.code,{children:"Authorization"})," header does use the Bearer scheme."]}),(0,i.jsx)(n.td,{children:"400"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_request', description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.' }"})}),(0,i.jsx)(n.td,{})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The token is black listed."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt revoked' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt revoked"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The token is not a JWT."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt malformed' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt malformed"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The signature is invalid."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt signature' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt signature"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The token is expired."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt expired' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt expired"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The audience is not expected."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt audience invalid. expected: xxx' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt audience invalid. expected: xxx"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"The issuer is not expected."}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'jwt issuer invalid. expected: xxx' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="jwt issuer invalid. expected: xxx"'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["There is no subject claim and ",(0,i.jsx)(n.code,{children:"options.user"})," is defined."]}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'The token must include a subject which is the id of the user.' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="The token must include a subject which is the id of the user."'})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"options.user"})," is defined and no user was found from its value (function)."]}),(0,i.jsx)(n.td,{children:"401"}),(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"{ code: 'invalid_token', description: 'The token subject does not match any user.' }"})}),(0,i.jsx)(n.td,{children:'error="invalid_token", error_description="The token subject does not match any user."'})]})]})]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>c});var i=t(96540);const r={},s=i.createContext(r);function o(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);