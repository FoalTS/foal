"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[823],{63807:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>a});var o=n(74848),i=n(28453);const r={title:"Gu\xeda de Actualizaci\xf3n a la Versi\xf3n 2",sidebar_label:"A v2"},d=void 0,t={id:"upgrade-to-v2/README",title:"Gu\xeda de Actualizaci\xf3n a la Versi\xf3n 2",description:"This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github.",source:"@site/i18n/es/docusaurus-plugin-content-docs/version-2.x/upgrade-to-v2/README.md",sourceDirName:"upgrade-to-v2",slug:"/upgrade-to-v2/",permalink:"/es/docs/2.x/upgrade-to-v2/",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/upgrade-to-v2/README.md",tags:[],version:"2.x",frontMatter:{title:"Gu\xeda de Actualizaci\xf3n a la Versi\xf3n 2",sidebar_label:"A v2"},sidebar:"someSidebar",previous:{title:"Express / Fastify",permalink:"/es/docs/2.x/comparison-with-other-frameworks/express-fastify"},next:{title:"Awesome Foal",permalink:"/es/docs/2.x/community/awesome-foal"}},c={},a=[{value:"For all",id:"for-all",level:2},{value:"By topic",id:"by-topic",level:2},{value:"Common issue",id:"common-issue",level:2},{value:"Rare cases",id:"rare-cases",level:2}];function l(e){const s={a:"a",code:"code",h2:"h2",li:"li",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(s.p,{children:"This guide will take you step by step through the upgrade to version 2. If something is missing or incorrect, feel free to submit an issue or a PR on Github."}),"\n",(0,o.jsxs)(s.table,{children:[(0,o.jsx)(s.thead,{children:(0,o.jsxs)(s.tr,{children:[(0,o.jsx)(s.th,{children:"Node versions"}),(0,o.jsx)(s.th,{children:"TS min version"})]})}),(0,o.jsx)(s.tbody,{children:(0,o.jsxs)(s.tr,{children:[(0,o.jsx)(s.td,{children:"10.x, 12.x, 14.x"}),(0,o.jsx)(s.td,{children:"4.0"})]})})]}),"\n",(0,o.jsx)(s.h2,{id:"for-all",children:"For all"}),"\n",(0,o.jsx)(s.p,{children:"Upgrade your versions of TypeScript and Node.JS if necessary."}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/cli-commands",children:"New CLI commands"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/config-system",children:"New configuration system"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/application-creation",children:"Application creation"})}),"\n",(0,o.jsx)(s.h2,{id:"by-topic",children:"By topic"}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/validation-hooks",children:"Validation hooks"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/session-tokens",children:"Authentication with sessions (session tokens) and CSRF protection"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/openapi",children:"OpenAPI"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/service-and-app-initialization",children:"Service and application initialization"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/file-upload-and-download",children:"File upload and download"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/jwt-and-csrf",children:"JWT hooks and CSRF protection"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/mongodb",children:"Support of MongoDB"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/error-handling",children:"Error-handling and hook post functions"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/template-engine",children:"Template engine"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.a,{href:"/es/docs/2.x/upgrade-to-v2/custom-express-instance",children:"Custom Express instance"})}),"\n",(0,o.jsx)(s.h2,{id:"common-issue",children:"Common issue"}),"\n",(0,o.jsx)(s.p,{children:"If you get unexpected errors when building the application, please check the following points:"}),"\n",(0,o.jsxs)(s.ul,{children:["\n",(0,o.jsxs)(s.li,{children:["You have updated all your ",(0,o.jsx)(s.code,{children:"@foal/x"})," packages."]}),"\n",(0,o.jsxs)(s.li,{children:["You have updated your ",(0,o.jsx)(s.code,{children:"typescript"})," dependency to version 4."]}),"\n"]}),"\n",(0,o.jsx)(s.h2,{id:"rare-cases",children:"Rare cases"}),"\n",(0,o.jsxs)(s.ul,{children:["\n",(0,o.jsxs)(s.li,{children:["The following objects and functions have been removed: ",(0,o.jsx)(s.code,{children:"ObjectDoesNotExist"}),", ",(0,o.jsx)(s.code,{children:"isObjectDoesNotExist"}),", ",(0,o.jsx)(s.code,{children:"PermissionDenied"}),", ",(0,o.jsx)(s.code,{children:"isPermissionDenied"}),", ",(0,o.jsx)(s.code,{children:"ValidationError"}),", ",(0,o.jsx)(s.code,{children:"isValidationError"}),", ",(0,o.jsx)(s.code,{children:"validate"}),"."]}),"\n",(0,o.jsxs)(s.li,{children:["The ",(0,o.jsx)(s.code,{children:"legacy"})," option has been removed from ",(0,o.jsx)(s.code,{children:"hashPassword"})," and ",(0,o.jsx)(s.code,{children:"verifyPassword"}),". If you used it, please submit an issue."]}),"\n",(0,o.jsxs)(s.li,{children:["The command ",(0,o.jsx)(s.code,{children:"foal g sub-app"})," has been removed."]}),"\n",(0,o.jsxs)(s.li,{children:["The functions ",(0,o.jsx)(s.code,{children:"createService"})," and ",(0,o.jsx)(s.code,{children:"createController"})," do not accept a ",(0,o.jsx)(s.code,{children:"ServiceManager"})," as second argument."]}),"\n",(0,o.jsxs)(s.li,{children:["The ",(0,o.jsx)(s.code,{children:"@Hook"})," decorator only accepts one function."]}),"\n",(0,o.jsxs)(s.li,{children:["The type ",(0,o.jsx)(s.code,{children:"ExpressApplication = any"})," has been removed."]}),"\n",(0,o.jsxs)(s.li,{children:["The property ",(0,o.jsx)(s.code,{children:"req.foal.ctx"})," does not exist anymore in post middlewares."]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,i.R)(),...e.components};return s?(0,o.jsx)(s,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>d,x:()=>t});var o=n(96540);const i={},r=o.createContext(i);function d(e){const s=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),o.createElement(r.Provider,{value:s},e.children)}}}]);