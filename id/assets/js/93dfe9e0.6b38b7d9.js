"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5728],{47658:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>d,metadata:()=>t,toc:()=>a});var i=s(74848),o=s(28453);const d={title:"Update Guide to Version 2",sidebar_label:"To v2"},r=void 0,t={id:"upgrade-to-v2/README",title:"Update Guide to Version 2",description:"This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github.",source:"@site/i18n/id/docusaurus-plugin-content-docs/version-2.x/upgrade-to-v2/README.md",sourceDirName:"upgrade-to-v2",slug:"/upgrade-to-v2/",permalink:"/id/docs/2.x/upgrade-to-v2/",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/upgrade-to-v2/README.md",tags:[],version:"2.x",frontMatter:{title:"Update Guide to Version 2",sidebar_label:"To v2"},sidebar:"someSidebar",previous:{title:"Express / Fastify",permalink:"/id/docs/2.x/comparison-with-other-frameworks/express-fastify"},next:{title:"Awesome Foal",permalink:"/id/docs/2.x/community/awesome-foal"}},c={},a=[{value:"For all",id:"for-all",level:2},{value:"By topic",id:"by-topic",level:2},{value:"Common issue",id:"common-issue",level:2},{value:"Rare cases",id:"rare-cases",level:2}];function l(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github."}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"Node versions"}),(0,i.jsx)(n.th,{children:"TS min version"})]})}),(0,i.jsx)(n.tbody,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"10.x, 12.x, 14.x"}),(0,i.jsx)(n.td,{children:"4.0"})]})})]}),"\n",(0,i.jsx)(n.h2,{id:"for-all",children:"For all"}),"\n",(0,i.jsx)(n.p,{children:"Upgrade your versions of TypeScript and Node.JS if necessary."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/cli-commands",children:"New CLI commands"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/config-system",children:"New configuration system"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/application-creation",children:"Application creation"})}),"\n",(0,i.jsx)(n.h2,{id:"by-topic",children:"By topic"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/validation-hooks",children:"Validation hooks"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/session-tokens",children:"Authentication with sessions (session tokens) and CSRF protection"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/openapi",children:"OpenAPI"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/service-and-app-initialization",children:"Service and application initialization"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/file-upload-and-download",children:"File upload and download"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/jwt-and-csrf",children:"JWT hooks and CSRF protection"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/mongodb",children:"Support of MongoDB"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/error-handling",children:"Error-handling and hook post functions"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/template-engine",children:"Template engine"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"/id/docs/2.x/upgrade-to-v2/custom-express-instance",children:"Custom Express instance"})}),"\n",(0,i.jsx)(n.h2,{id:"common-issue",children:"Common issue"}),"\n",(0,i.jsx)(n.p,{children:"If you get unexpected errors when building the application, please check the following points:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["You have updated all your ",(0,i.jsx)(n.code,{children:"@foal/x"})," packages."]}),"\n",(0,i.jsxs)(n.li,{children:["You have updated your ",(0,i.jsx)(n.code,{children:"typescript"})," dependency to version 4."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"rare-cases",children:"Rare cases"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The following objects and functions have been removed: ",(0,i.jsx)(n.code,{children:"ObjectDoesNotExist"}),", ",(0,i.jsx)(n.code,{children:"isObjectDoesNotExist"}),", ",(0,i.jsx)(n.code,{children:"PermissionDenied"}),", ",(0,i.jsx)(n.code,{children:"isPermissionDenied"}),", ",(0,i.jsx)(n.code,{children:"ValidationError"}),", ",(0,i.jsx)(n.code,{children:"isValidationError"}),", ",(0,i.jsx)(n.code,{children:"validate"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"legacy"})," option has been removed from ",(0,i.jsx)(n.code,{children:"hashPassword"})," and ",(0,i.jsx)(n.code,{children:"verifyPassword"}),". If you used it, please submit an issue."]}),"\n",(0,i.jsxs)(n.li,{children:["The command ",(0,i.jsx)(n.code,{children:"foal g sub-app"})," has been removed."]}),"\n",(0,i.jsxs)(n.li,{children:["The functions ",(0,i.jsx)(n.code,{children:"createService"})," and ",(0,i.jsx)(n.code,{children:"createController"})," do not accept a ",(0,i.jsx)(n.code,{children:"ServiceManager"})," as second argument."]}),"\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"@Hook"})," decorator only accepts one function."]}),"\n",(0,i.jsxs)(n.li,{children:["The type ",(0,i.jsx)(n.code,{children:"ExpressApplication = any"})," has been removed."]}),"\n",(0,i.jsxs)(n.li,{children:["The property ",(0,i.jsx)(n.code,{children:"req.foal.ctx"})," does not exist anymore in post middlewares."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>t});var i=s(96540);const o={},d=i.createContext(o);function r(e){const n=i.useContext(d);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(d.Provider,{value:n},e.children)}}}]);