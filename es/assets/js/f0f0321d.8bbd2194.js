"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5503],{33303:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>s,default:()=>h,frontMatter:()=>c,metadata:()=>a,toc:()=>l});var t=i(74848),o=i(28453);const c={title:"Inicializaci\xf3n"},s=void 0,a={id:"architecture/initialization",title:"Inicializaci\xf3n",description:"In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database.",source:"@site/i18n/es/docusaurus-plugin-content-docs/current/architecture/initialization.md",sourceDirName:"architecture",slug:"/architecture/initialization",permalink:"/es/docs/architecture/initialization",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/architecture/initialization.md",tags:[],version:"current",frontMatter:{title:"Inicializaci\xf3n"},sidebar:"someSidebar",previous:{title:"Hooks",permalink:"/es/docs/architecture/hooks"},next:{title:"Gesti\xf3n de Errores",permalink:"/es/docs/architecture/error-handling"}},r={},l=[{value:"Initializing the Application",id:"initializing-the-application",level:2},{value:"Initializing a Service",id:"initializing-a-service",level:2},{value:"Best Practices",id:"best-practices",level:2}];function d(e){const n={blockquote:"blockquote",code:"code",em:"em",h2:"h2",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database."}),"\n",(0,t.jsx)(n.p,{children:"There are two ways to achieve this in FoalTS."}),"\n",(0,t.jsx)(n.h2,{id:"initializing-the-application",children:"Initializing the Application"}),"\n",(0,t.jsxs)(n.p,{children:["The first approach is to add an ",(0,t.jsx)(n.code,{children:"init"})," method to the root controller class which will be called before the application is fully created. This method can be synchronous or asynchronous."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example 1"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { dependency } from '@foal/core';\n\nimport { ServiceA } from '../services';\n\nexport class AppController {\n\n  @dependency\n  serviceA: ServiceA;\n\n  async init() {\n    await this.serviceA.doSomething();\n  }\n\n}\n"})}),"\n",(0,t.jsx)(n.h2,{id:"initializing-a-service",children:"Initializing a Service"}),"\n",(0,t.jsxs)(n.p,{children:["The second approach is to add a ",(0,t.jsx)(n.code,{children:"boot"})," method in your services. This method can be synchronous or asynchronous."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"export class ServiceA {\n\n  async boot() {\n    await doSomething();\n  }\n\n}\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Boot methods are executed before ",(0,t.jsx)(n.code,{children:"AppController.init"})," gets called."]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["If you manually inject services to your service manager and you want their ",(0,t.jsx)(n.code,{children:"boot"})," methods to be called, you must specify this in the ",(0,t.jsx)(n.code,{children:"set"})," method options."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"const serviceManager = new ServiceManager();\nserviceManager.set(ServiceA, myServiceInstance, { boot: true });\n"})}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"best-practices",children:"Best Practices"}),"\n",(0,t.jsxs)(n.p,{children:["If your initialization consists of several asynchronous tasks, you may want to perform them in ",(0,t.jsx)(n.em,{children:"parallel"}),". This will reduce the initialization time, which has an impact if you use a serverless architecture."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"export class AppController {\n\n  async init() {\n    // Don't do\n    await createConnection();\n    await createAnotherConnection();\n\n    // Do\n    await Promise.all([\n      createConnection(),\n      createAnotherConnection()\n    ])\n  }\n\n}\n"})})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>a});var t=i(96540);const o={},c=t.createContext(o);function s(e){const n=t.useContext(c);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),t.createElement(c.Provider,{value:n},e.children)}}}]);