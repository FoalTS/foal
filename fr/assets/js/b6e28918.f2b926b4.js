"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1028],{89116:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var s=t(74848),r=t(28453);const i={title:"Cr\xe9er et Ex\xe9cuter des Scripts",sidebar_label:"Cr\xe9er & Ex\xe9cuter des Scripts"},c=void 0,o={id:"development-environment/create-and-run-scripts",title:"Cr\xe9er et Ex\xe9cuter des Scripts",description:"Sometimes we have to execute some tasks from the command line. These tasks can serve different purposes such as populating a database (user creation, etc) for instance. They often need to access some of the app classes and functions. This is when shell scripts come into play.",source:"@site/i18n/fr/docusaurus-plugin-content-docs/version-2.x/development-environment/create-and-run-scripts.md",sourceDirName:"development-environment",slug:"/development-environment/create-and-run-scripts",permalink:"/fr/docs/2.x/development-environment/create-and-run-scripts",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/development-environment/create-and-run-scripts.md",tags:[],version:"2.x",frontMatter:{title:"Cr\xe9er et Ex\xe9cuter des Scripts",sidebar_label:"Cr\xe9er & Ex\xe9cuter des Scripts"},sidebar:"someSidebar",previous:{title:"Construire & D\xe9marrer l'App",permalink:"/fr/docs/2.x/development-environment/build-and-start-the-app"},next:{title:"Code Generation",permalink:"/fr/docs/2.x/development-environment/code-generation"}},a={},l=[{value:"Create Scripts",id:"create-scripts",level:2},{value:"Write Scripts",id:"write-scripts",level:2},{value:"Build and Run Scripts",id:"build-and-run-scripts",level:2}];function d(e){const n={blockquote:"blockquote",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Sometimes we have to execute some tasks from the command line. These tasks can serve different purposes such as populating a database (user creation, etc) for instance. They often need to access some of the app classes and functions. This is when shell scripts come into play."}),"\n",(0,s.jsx)(n.h2,{id:"create-scripts",children:"Create Scripts"}),"\n",(0,s.jsxs)(n.p,{children:["A shell script is just a TypeScript file located in the ",(0,s.jsx)(n.code,{children:"src/scripts"}),". It must export a ",(0,s.jsx)(n.code,{children:"main"})," function that is then called when running the script."]}),"\n",(0,s.jsxs)(n.p,{children:["Let's create a new one with the command line: ",(0,s.jsx)(n.code,{children:"foal g script display-users"}),". A new file with a default template should appear in you ",(0,s.jsx)(n.code,{children:"src/scripts"})," directory."]}),"\n",(0,s.jsx)(n.h2,{id:"write-scripts",children:"Write Scripts"}),"\n",(0,s.jsxs)(n.p,{children:["Remove the content of ",(0,s.jsx)(n.code,{children:"src/scripts/display-users.ts"})," and replace it with the below code."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"// 3p\nimport { createService } from '@foal/core';\nimport { createConnection } from 'typeorm';\n\n// App\nimport { User } from '../app/entities';\nimport { Logger } from '../app/services';\n\nexport async function main() {\n  const connection = await createConnection();\n  try {\n    const users = await connection.getRepository(User).find();\n    const logger = createService(Logger);\n    logger.log(users);\n  } finally {\n    connection.close();\n  }\n}\n\n"})}),"\n",(0,s.jsxs)(n.p,{children:["As you can see, we can easily establish a connection to the database in the script as well as import some of the app components (the ",(0,s.jsx)(n.code,{children:"User"})," in this case)."]}),"\n",(0,s.jsxs)(n.p,{children:["Encapsulating your code in a ",(0,s.jsx)(n.code,{children:"main"})," function without calling it directly in the file has several benefits:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["You can import and test your ",(0,s.jsx)(n.code,{children:"main"})," function in a separate file."]}),"\n",(0,s.jsx)(n.li,{children:"Using a function lets you easily use async/await keywords when dealing with asynchronous code."}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"build-and-run-scripts",children:"Build and Run Scripts"}),"\n",(0,s.jsx)(n.p,{children:"To run a script you first need to build it."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"npm run build\n"})}),"\n",(0,s.jsx)(n.p,{children:"Then you can execute it with this command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"foal run my-script # or foal run-script my-script\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["You can also provide additionnal arguments to your script (for example: ",(0,s.jsx)(n.code,{children:"foal run my-script foo=1 bar='[ 3, 4 ]'"}),"). The default template in the generated scripts shows you how to handle such behavior."]}),"\n"]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["If you want your script to recompile each time you save the file, you can run ",(0,s.jsx)(n.code,{children:"npm run develop"})," in a separate terminal."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>c,x:()=>o});var s=t(96540);const r={},i=s.createContext(r);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);