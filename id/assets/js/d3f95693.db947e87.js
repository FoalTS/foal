"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8182],{31538:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>a,toc:()=>c});var n=o(74848),i=o(28453);const r={title:"CSRF Protection",id:"tuto-13-csrf",slug:"13-csrf"},s=void 0,a={id:"tutorials/real-world-example-with-react/tuto-13-csrf",title:"CSRF Protection",description:"Since you use authentication with cookies, you need to add CSRF protection to your application.  This is really easy with Foal, even when building a SPA.",source:"@site/i18n/id/docusaurus-plugin-content-docs/version-3.x/tutorials/real-world-example-with-react/13-csrf.md",sourceDirName:"tutorials/real-world-example-with-react",slug:"/tutorials/real-world-example-with-react/13-csrf",permalink:"/id/docs/3.x/tutorials/real-world-example-with-react/13-csrf",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-3.x/tutorials/real-world-example-with-react/13-csrf.md",tags:[],version:"3.x",sidebarPosition:13,frontMatter:{title:"CSRF Protection",id:"tuto-13-csrf",slug:"13-csrf"},sidebar:"someSidebar",previous:{title:"Image Upload and Download",permalink:"/id/docs/3.x/tutorials/real-world-example-with-react/12-file-upload"},next:{title:"Production Build",permalink:"/id/docs/3.x/tutorials/real-world-example-with-react/14-production-build"}},l={},c=[];function d(e){const t={a:"a",code:"code",img:"img",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Since you use authentication with cookies, you need to add CSRF protection to your application.  This is really easy with Foal, even when building a SPA."}),"\n",(0,n.jsxs)(t.p,{children:["Open the ",(0,n.jsx)(t.code,{children:"default.json"})," config file and enable the CSRF protection."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'{\n  "port": "env(PORT)",\n  "settings": {\n    "session": {\n      "store": "@foal/typeorm",\n      "csrf": {\n        "enabled": true\n      }\n    },\n    ...\n  }\n  ...\n}\n'})}),"\n",(0,n.jsxs)(t.p,{children:["Now, when using sessions with cookies, the server will send an additional token to the client in a cookie named ",(0,n.jsx)(t.code,{children:"XSRF-Token"}),". This token will have to be retrieved by the front-end application and sent back in every subsequent POST, PATCH, PUT and DELETE request with the ",(0,n.jsx)(t.code,{children:"X-XSRF-Token"})," header. If it is not, the server will return a 403 error."]}),"\n",(0,n.jsxs)(t.p,{children:["If you use ",(0,n.jsx)(t.a,{href:"https://www.npmjs.com/package/axios",children:"axios"})," as your request library, as in this tutorial, you don't have to do anything. Everything is handled in the background."]}),"\n",(0,n.jsx)(t.p,{children:"If you restart your development server and open your browser's development tools, you will see that axios automatically includes the token for you when creating a new story."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"X-XSRF-Token header example",src:o(6918).A+"",width:"1928",height:"116"})})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},6918:(e,t,o)=>{o.d(t,{A:()=>n});const n=o.p+"assets/images/csrf-a395cf4e61edfeaa39c97b11c168dc86.png"},28453:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>a});var n=o(96540);const i={},r=n.createContext(i);function s(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);