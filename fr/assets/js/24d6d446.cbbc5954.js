"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1897],{75:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>t,default:()=>h,frontMatter:()=>c,metadata:()=>i,toc:()=>a});var l=r(74848),s=r(28453);const c={title:"G\xe9n\xe9ration de Code"},t=void 0,i={id:"cli/code-generation",title:"G\xe9n\xe9ration de Code",description:"Create a project",source:"@site/i18n/fr/docusaurus-plugin-content-docs/version-3.x/cli/code-generation.md",sourceDirName:"cli",slug:"/cli/code-generation",permalink:"/fr/docs/3.x/cli/code-generation",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-3.x/cli/code-generation.md",tags:[],version:"3.x",frontMatter:{title:"G\xe9n\xe9ration de Code"},sidebar:"someSidebar",previous:{title:"Shell Scripts",permalink:"/fr/docs/3.x/cli/shell-scripts"},next:{title:"Linting",permalink:"/fr/docs/3.x/cli/linting-and-code-style"}},o={},a=[{value:"Create a project",id:"create-a-project",level:2},{value:"Create a controller",id:"create-a-controller",level:2},{value:"The <code>--register</code> flag",id:"the---register-flag",level:3},{value:"Create an entity",id:"create-an-entity",level:2},{value:"Create REST API",id:"create-rest-api",level:2},{value:"The <code>--register</code> flag",id:"the---register-flag-1",level:3},{value:"Create a hook",id:"create-a-hook",level:2},{value:"Create a script",id:"create-a-script",level:2},{value:"Create a service",id:"create-a-service",level:2}];function d(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.h2,{id:"create-a-project",children:"Create a project"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal createapp my-app\n"})}),"\n",(0,l.jsx)(n.p,{children:"Create a new directory with all the required files to get started."}),"\n",(0,l.jsxs)(n.p,{children:["If you specify the flag ",(0,l.jsx)(n.code,{children:"--mongodb"}),", the CLI will generate a new project using MongoDB instead of SQLite."]}),"\n",(0,l.jsxs)(n.p,{children:["If you specify the flag ",(0,l.jsx)(n.code,{children:"--yaml"}),", the new project will use YAML format for its configuration files. You can find more information ",(0,l.jsx)(n.a,{href:"/fr/docs/3.x/architecture/configuration",children:"here"}),"."]}),"\n",(0,l.jsx)(n.h2,{id:"create-a-controller",children:"Create a controller"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g controller <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new controller in ",(0,l.jsx)(n.code,{children:"./src/app/controllers"}),", in ",(0,l.jsx)(n.code,{children:"./controllers"})," or in the current directory depending on which folders are found."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g controller auth\nfoal g controller api/product\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  '- controllers/\n   |- api/\n   | |- product.controller.ts\n   | '- index.ts\n   |- auth.controller.ts\n   '- index.ts\n"})}),"\n",(0,l.jsxs)(n.h3,{id:"the---register-flag",children:["The ",(0,l.jsx)(n.code,{children:"--register"})," flag"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g controller <name> --register\n"})}),"\n",(0,l.jsxs)(n.p,{children:["If you wish to automatically create a new route attached to this controller, you can use the ",(0,l.jsx)(n.code,{children:"--register"})," flag to do so."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g controller api --register\nfoal g controller api/product --register\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  |- controllers/\n  | |- api/\n  | | |- product.controller.ts\n  | | '- index.ts\n  | |- api.controller.ts\n  | '- index.ts\n  '- app.controller.ts\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"app.controller.ts"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-typescript",children:"export class AppController {\n  subControllers = [\n    controller('/api', ApiController)\n  ]\n}\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"api.controller.ts"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-typescript",children:"export class ApiController {\n  subControllers = [\n    controller('/product', ProductController)\n  ]\n}\n"})}),"\n",(0,l.jsx)(n.h2,{id:"create-an-entity",children:"Create an entity"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g entity <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new entity in ",(0,l.jsx)(n.code,{children:"./src/app/entities"}),", in ",(0,l.jsx)(n.code,{children:"./entities"})," or in the current directory depending on which folders are found."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g entity user\nfoal g entity business/product\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  '- entities/\n   |- business/\n   | |- product.entity.ts\n   | '- index.ts\n   |- user.entity.ts\n   '- index.ts\n"})}),"\n",(0,l.jsx)(n.h2,{id:"create-rest-api",children:"Create REST API"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g rest-api <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new controller and a new entity to build a basic REST API. Depending on which directories are found, they will be generated in ",(0,l.jsx)(n.code,{children:"src/app/{entities}|{controllers}/"})," or in ",(0,l.jsx)(n.code,{children:"{entities}|{controllers}/"}),"."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g rest-api order\nfoal g rest-api api/product\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  |- controllers/\n  | |- api/\n  | | |- product.controller.ts\n  | | '- index.ts\n  | |- order.controller.ts\n  | '- index.ts\n  '- entities/\n    |- index.entity.ts\n    |- order.entity.ts\n    '- index.ts\n"})}),"\n",(0,l.jsxs)(n.h3,{id:"the---register-flag-1",children:["The ",(0,l.jsx)(n.code,{children:"--register"})," flag"]}),"\n",(0,l.jsxs)(n.p,{children:["If you wish to automatically create a new route attached to this controller, you can use the ",(0,l.jsx)(n.code,{children:"--register"})," flag to do so (see ",(0,l.jsx)(n.a,{href:"#create-a-controller",children:"create-a-controller"}),")."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g controller api --register\nfoal g controller api/product --register\n"})}),"\n",(0,l.jsxs)(n.p,{children:["See the page ",(0,l.jsx)(n.a,{href:"/fr/docs/3.x/common/rest-blueprints",children:"REST Blueprints"})," for more details."]}),"\n",(0,l.jsx)(n.h2,{id:"create-a-hook",children:"Create a hook"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g hook <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new hook in ",(0,l.jsx)(n.code,{children:"./src/app/hooks"}),", in ",(0,l.jsx)(n.code,{children:"./hooks"})," or in the current directory depending on which folders are found."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g hook log\nfoal g hook auth/admin-required\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  '- hooks/\n   |- auth/\n   | |- admin-required.hook.ts\n   | '- index.ts\n   |- log.hook.ts\n   '- index.ts\n"})}),"\n",(0,l.jsx)(n.h2,{id:"create-a-script",children:"Create a script"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g script <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new shell script in ",(0,l.jsx)(n.code,{children:"src/scripts"})," regardless of where you run the command."]}),"\n",(0,l.jsx)(n.h2,{id:"create-a-service",children:"Create a service"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g service <name>\n"})}),"\n",(0,l.jsxs)(n.p,{children:["Create a new service in ",(0,l.jsx)(n.code,{children:"./src/app/services"}),", in ",(0,l.jsx)(n.code,{children:"./services"})," or in the current directory depending on which folders are found."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Example"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"foal g service auth\nfoal g service apis/github\n"})}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.em,{children:"Output"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"src/\n '- app/\n  '- services/\n   |- apis/\n   | '- github.service.ts\n   | '- index.ts\n   |- auth.service.ts\n   '- index.ts\n"})})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>t,x:()=>i});var l=r(96540);const s={},c=l.createContext(s);function t(e){const n=l.useContext(c);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:t(e.components),l.createElement(c.Provider,{value:n},e.children)}}}]);