"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4134],{142:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var r=n(74848),o=n(28453);const s={title:"Arquitectura"},i=void 0,a={id:"architecture/architecture-overview",title:"Arquitectura",description:"FoalTS is a framework for creating server-side Node.js applications. It is written in TypeScript, a typed superset of JavaScript that provides advanced development tools and the latest language features.",source:"@site/i18n/es/docusaurus-plugin-content-docs/version-2.x/architecture/architecture-overview.md",sourceDirName:"architecture",slug:"/architecture/architecture-overview",permalink:"/es/docs/2.x/architecture/architecture-overview",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/architecture/architecture-overview.md",tags:[],version:"2.x",frontMatter:{title:"Arquitectura"},sidebar:"someSidebar",previous:{title:"Autenticaci\xf3n Social con Google",permalink:"/es/docs/2.x/tutorials/real-world-example-with-react/15-social-auth"},next:{title:"Controladores",permalink:"/es/docs/2.x/architecture/controllers"}},c={},l=[{value:"Controllers",id:"controllers",level:2},{value:"Services",id:"services",level:2},{value:"Hooks",id:"hooks",level:2},{value:"A Simple Application",id:"a-simple-application",level:2}];function p(e){const t={a:"a",code:"code",h2:"h2",img:"img",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["FoalTS is a framework for creating server-side ",(0,r.jsx)(t.a,{href:"https://nodejs.org",children:"Node.js"})," applications. It is written in ",(0,r.jsx)(t.a,{href:"https://www.typescriptlang.org/",children:"TypeScript"}),", a typed superset of JavaScript that provides advanced development tools and the latest language features."]}),"\n",(0,r.jsx)(t.p,{children:"FoalTS architecture is organized around three main components: controllers, services and hooks."}),"\n",(0,r.jsx)(t.h2,{id:"controllers",children:"Controllers"}),"\n",(0,r.jsx)(t.p,{children:"Controllers are classes instantiated as singletons. Their methods process the incoming HTTP requests."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"import { Get, HttpResponseOK } from '@foal/core';\n\nclass AppController {\n\n  @Get('/')\n  index() {\n    return new HttpResponseOK('Hello world!');\n  }\n\n}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"services",children:"Services"}),"\n",(0,r.jsx)(t.p,{children:"Services are also classes instantiated as singletons. They are used by the controllers (or hooks) to perform specific tasks."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"import { dependency, Get, HttpResponseOK } from '@foal/core';\n\nclass FormatService {\n  withDate(message: string): string {\n    return `${new Date()} - ${message}`;\n  }\n}\n\nclass AppController {\n  @dependency\n  format: FormatService;\n\n  @Get('/')\n  index() {\n    const message = this.format.withDate('Hello world!');\n    return new HttpResponseOK(message);\n  }\n\n}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"hooks",children:"Hooks"}),"\n",(0,r.jsx)(t.p,{children:"Hooks are small functions that add extra logic before or after the execution of a controller method."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"import { Get, HttpResponseOK } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\n\nclass AppController {\n\n  @Get('/')\n  @JWTRequired()\n  index() {\n    return new HttpResponseOK('Hello world!');\n  }\n\n}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"a-simple-application",children:"A Simple Application"}),"\n",(0,r.jsx)(t.p,{children:"Controllers may have sub-controllers. Hooks can be attached to the controllers or their methods."}),"\n",(0,r.jsx)(t.p,{children:"Here's an example of what a FoalTS application may look like."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"import { Context, controller, Get, HttpResponseNotFound, HttpResponseOK, Log } from '@foal/core';\nimport { JWTRequired } from '@foal/jwt';\n\n@JWTRequired()\nclass ApiController {\n  private products = [\n    { id: 1, name: 'phone' },\n    { id: 2, name: 'computer' },\n  ]\n\n  @Get('/products')\n  listProducts() {\n    return new HttpResponseOK(this.products);\n  }\n\n  @Get('/products/:id')\n  getProduct(ctx: Context) {\n    const product = this.products.find(\n      p => p.id === parseInt(ctx.request.params.id, 10)\n    );\n\n    if (!product) {\n      return new HttpResponseNotFound();\n    }\n\n    return new HttpResponseOK(product);\n  }\n}\n\n@Log('Receiving a request...')\nclass AppController {\n  subControllers = [\n    controller('/api', ApiController)\n  ];\n\n  @Get('/')\n  index() {\n    return new HttpResponseOK('Welcome!');\n  }\n}\n"})}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.img,{alt:"Request Lifecycle",src:n(61103).A+"",width:"677",height:"359"})})]})}function d(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},61103:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/request_lifecycle-6483154b08c8a22d7412d0fa953a7304.png"},28453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>a});var r=n(96540);const o={},s=r.createContext(o);function i(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);