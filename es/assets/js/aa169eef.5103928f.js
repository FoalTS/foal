"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2575],{30431:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>r,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var t=n(74848),o=n(28453);const s={title:"Inicializaci\xf3n"},c=void 0,a={id:"architecture/initialization",title:"Inicializaci\xf3n",description:"In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database.",source:"@site/i18n/es/docusaurus-plugin-content-docs/version-2.x/architecture/initialization.md",sourceDirName:"architecture",slug:"/architecture/initialization",permalink:"/es/docs/2.x/architecture/initialization",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/architecture/initialization.md",tags:[],version:"2.x",frontMatter:{title:"Inicializaci\xf3n"},sidebar:"someSidebar",previous:{title:"Hooks",permalink:"/es/docs/2.x/architecture/hooks"},next:{title:"Gesti\xf3n de Errores",permalink:"/es/docs/2.x/architecture/error-handling"}},r={},l=[{value:"Initializing the Application",id:"initializing-the-application",level:2},{value:"Initializing a Service",id:"initializing-a-service",level:2},{value:"Best Practices",id:"best-practices",level:2}];function d(e){const i={blockquote:"blockquote",code:"code",em:"em",h2:"h2",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.p,{children:"In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database."}),"\n",(0,t.jsx)(i.p,{children:"There are two ways to achieve this in FoalTS."}),"\n",(0,t.jsx)(i.h2,{id:"initializing-the-application",children:"Initializing the Application"}),"\n",(0,t.jsxs)(i.p,{children:["The first approach is to add an ",(0,t.jsx)(i.code,{children:"init"})," method to the root controller class which will be called before the application is fully created. This method can be synchronous or asynchronous."]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"Example 1"})}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-typescript",children:"import { dependency } from '@foal/core';\n\nimport { ServiceA } from '../services';\n\nexport class AppController {\n\n  @dependency\n  serviceA: ServiceA;\n\n  async init() {\n    await this.serviceA.doSomething();\n  }\n\n}\n"})}),"\n",(0,t.jsx)(i.h2,{id:"initializing-a-service",children:"Initializing a Service"}),"\n",(0,t.jsxs)(i.p,{children:["The second approach is to add a ",(0,t.jsx)(i.code,{children:"boot"})," method in your services. This method can be synchronous or asynchronous."]}),"\n",(0,t.jsx)(i.p,{children:(0,t.jsx)(i.em,{children:"Example"})}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-typescript",children:"export class ServiceA {\n\n  async boot() {\n    await doSomething();\n  }\n\n}\n"})}),"\n",(0,t.jsxs)(i.p,{children:["Boot methods are executed before ",(0,t.jsx)(i.code,{children:"AppController.init"})," gets called."]}),"\n",(0,t.jsxs)(i.blockquote,{children:["\n",(0,t.jsxs)(i.p,{children:["If you manually inject services to your service manager and you want their ",(0,t.jsx)(i.code,{children:"boot"})," methods to be called, you must specify this in the ",(0,t.jsx)(i.code,{children:"set"})," method options."]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-typescript",children:"const serviceManager = new ServiceManager();\nserviceManager.set(ServiceA, myServiceInstance, { boot: true });\n"})}),"\n"]}),"\n",(0,t.jsx)(i.h2,{id:"best-practices",children:"Best Practices"}),"\n",(0,t.jsxs)(i.p,{children:["If your initialization consists of several asynchronous tasks, you may want to perform them in ",(0,t.jsx)(i.em,{children:"parallel"}),". This will reduce the initialization time, which has an impact if you use a serverless architecture."]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-typescript",children:"export class AppController {\n\n  async init() {\n    // Don't do\n    await createConnection();\n    await createAnotherConnection();\n\n    // Do\n    await Promise.all([\n      createConnection(),\n      createAnotherConnection()\n    ])\n  }\n\n}\n"})})]})}function h(e={}){const{wrapper:i}={...(0,o.R)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},28453:(e,i,n)=>{n.d(i,{R:()=>c,x:()=>a});var t=n(96540);const o={},s=t.createContext(o);function c(e){const i=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),t.createElement(s.Provider,{value:i},e.children)}}}]);