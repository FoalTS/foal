"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5264],{11466:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>c,default:()=>l,frontMatter:()=>r,metadata:()=>p,toc:()=>i});var s=n(74848),o=n(28453);const r={title:"Custom Express Instance"},c=void 0,p={id:"upgrade-to-v2/custom-express-instance",title:"Custom Express Instance",description:"FoalTS allows to provide a custom Express instance to the createApp function. In version 1, there were two ways to do it. In version 2, there is only one.",source:"@site/versioned_docs/version-2.x/upgrade-to-v2/custom-express-instance.md",sourceDirName:"upgrade-to-v2",slug:"/upgrade-to-v2/custom-express-instance",permalink:"/docs/2.x/upgrade-to-v2/custom-express-instance",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/upgrade-to-v2/custom-express-instance.md",tags:[],version:"2.x",frontMatter:{title:"Custom Express Instance"}},a={},i=[];function d(e){const t={code:"code",em:"em",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["FoalTS allows to provide a custom Express instance to the ",(0,s.jsx)(t.code,{children:"createApp"})," function. In version 1, there were two ways to do it. In version 2, there is only one."]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Version 1"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"const app = createApp(AppController, expressApp);\n// OR\nconst app = createApp(AppController, {\n  expressInstance: expressApp\n});\n"})}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.em,{children:"Version 2"})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"const app = await createApp(AppController, {\n  expressInstance: expressApp\n});\n"})})]})}function l(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>c,x:()=>p});var s=n(96540);const o={},r=s.createContext(o);function c(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function p(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);