"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7574],{97016:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>l});var s=t(74848),i=t(28453);const r={title:"Nuxt.js"},o=void 0,d={id:"frontend-integration/nuxt.js",title:"Nuxt.js",description:"Nuxt.js is a frontend framework based on Vue.JS.",source:"@site/i18n/id/docusaurus-plugin-content-docs/version-2.x/frontend-integration/nuxt.js.md",sourceDirName:"frontend-integration",slug:"/frontend-integration/nuxt.js",permalink:"/id/docs/2.x/frontend-integration/nuxt.js",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/frontend-integration/nuxt.js.md",tags:[],version:"2.x",frontMatter:{title:"Nuxt.js"},sidebar:"someSidebar",previous:{title:"JSX Server-Side Rendering",permalink:"/id/docs/2.x/frontend-integration/jsx-server-side-rendering"},next:{title:"Local & Cloud Storage",permalink:"/id/docs/2.x/file-system/local-and-cloud-storage"}},c={},l=[{value:"Installation",id:"installation",level:2},{value:"Set Up",id:"set-up",level:2}];function a(n){const e={a:"a",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...n.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(e.p,{children:[(0,s.jsx)(e.a,{href:"https://nuxtjs.org/",children:"Nuxt.js"})," is a frontend framework based on ",(0,s.jsx)(e.a,{href:"http://vuejs.org",children:"Vue.JS"}),"."]}),"\n",(0,s.jsx)(e.p,{children:"This document explains how to use it in conjunction with FoalTS."}),"\n",(0,s.jsx)(e.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsx)(e.p,{children:"Create your frontend and backend projects in two different folders."}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"foal createapp backend\nnpx create-nuxt-app frontend\n"})}),"\n",(0,s.jsx)(e.h2,{id:"set-up",children:"Set Up"}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsxs)(e.li,{children:["\n",(0,s.jsxs)(e.p,{children:["Open the file ",(0,s.jsx)(e.code,{children:"nuxt.config.js"})," in the ",(0,s.jsx)(e.code,{children:"frontend/"})," directory, move it to your ",(0,s.jsx)(e.code,{children:"backend/"})," directory and update its first lines as follows:"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-typescript",children:"module.exports = {\n  srcDir: '../frontend',\n  // ...\n}\n"})}),"\n"]}),"\n",(0,s.jsxs)(e.li,{children:["\n",(0,s.jsxs)(e.p,{children:["Go to your server directory and install ",(0,s.jsx)(e.code,{children:"nuxt"}),"."]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{children:"npm install nuxt\n"})}),"\n"]}),"\n",(0,s.jsxs)(e.li,{children:["\n",(0,s.jsxs)(e.p,{children:["Then update your ",(0,s.jsx)(e.code,{children:"src/index.ts"})," file as follows:"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-typescript",children:"import { loadNuxt, build } from 'nuxt';\n// ...\n\nasync function main() {\n  const isDev = process.env.NODE_ENV !== 'production';\n  // We get Nuxt instance\n  const nuxt = await loadNuxt(isDev ? 'dev' : 'start');\n\n  if (isDev) {\n    build(nuxt)\n  }\n\n  // ...\n\n  const app = await createApp(AppController, {\n    postMiddlewares: [\n      nuxt.render\n    ]\n  });\n\n  // ...\n}\n\nmain();\n\n"})}),"\n"]}),"\n",(0,s.jsxs)(e.li,{children:["\n",(0,s.jsxs)(e.p,{children:["Finally, delete the file ",(0,s.jsx)(e.code,{children:"index.html"})," in ",(0,s.jsx)(e.code,{children:"backend/public"}),"."]}),"\n"]}),"\n"]})]})}function u(n={}){const{wrapper:e}={...(0,i.R)(),...n.components};return e?(0,s.jsx)(e,{...n,children:(0,s.jsx)(a,{...n})}):a(n)}},28453:(n,e,t)=>{t.d(e,{R:()=>o,x:()=>d});var s=t(96540);const i={},r=s.createContext(i);function o(n){const e=s.useContext(r);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function d(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:o(n.components),s.createElement(r.Provider,{value:e},n.children)}}}]);