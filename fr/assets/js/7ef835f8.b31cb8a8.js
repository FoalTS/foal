"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7231],{26174:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var o=r(74848),n=r(28453);const s={title:"Protection CSRF",id:"tuto-13-csrf",slug:"13-csrf"},i=void 0,a={id:"tutorials/real-world-example-with-react/tuto-13-csrf",title:"Protection CSRF",description:"Comme vous utilisez l'authentification avec des cookies, vous devez ajouter une protection CSRF \xe0 votre application. C'est tr\xe8s facile avec Foal, m\xeame lorsque vous construisez une SPA.",source:"@site/i18n/fr/docusaurus-plugin-content-docs/current/tutorials/real-world-example-with-react/13-csrf.md",sourceDirName:"tutorials/real-world-example-with-react",slug:"/tutorials/real-world-example-with-react/13-csrf",permalink:"/fr/docs/tutorials/real-world-example-with-react/13-csrf",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/tutorials/real-world-example-with-react/13-csrf.md",tags:[],version:"current",sidebarPosition:13,frontMatter:{title:"Protection CSRF",id:"tuto-13-csrf",slug:"13-csrf"},sidebar:"someSidebar",previous:{title:"T\xe9l\xe9chargement d'Images",permalink:"/fr/docs/tutorials/real-world-example-with-react/12-file-upload"},next:{title:"Construction de Production",permalink:"/fr/docs/tutorials/real-world-example-with-react/14-production-build"}},c={},l=[];function u(e){const t={a:"a",code:"code",img:"img",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.p,{children:"Comme vous utilisez l'authentification avec des cookies, vous devez ajouter une protection CSRF \xe0 votre application. C'est tr\xe8s facile avec Foal, m\xeame lorsque vous construisez une SPA."}),"\n",(0,o.jsxs)(t.p,{children:["Ouvrez le fichier de configuration ",(0,o.jsx)(t.code,{children:"default.json"})," et activez la protection CSRF."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-json",children:'{\n  "port": "env(PORT)",\n  "settings": {\n    "session": {\n      "store": "@foal/typeorm",\n      "csrf": {\n        "enabled": true\n      }\n    },\n    ...\n  }\n  ...\n}\n'})}),"\n",(0,o.jsxs)(t.p,{children:["Maintenant, lorsque les sessions seront utilis\xe9es avec des cookies, le serveur enverra un jeton suppl\xe9mentaire au client dans un cookie nomm\xe9 ",(0,o.jsx)(t.code,{children:"XSRF-Token"}),". Ce jeton devra \xeatre r\xe9cup\xe9r\xe9 par l'application frontend et renvoy\xe9 dans chaque requ\xeate POST, PATCH, PUT et DELETE avec l'en-t\xeate ",(0,o.jsx)(t.code,{children:"X-XSRF-Token"}),". Si ce n'est pas le cas, le serveur renverra une erreur 403."]}),"\n",(0,o.jsxs)(t.p,{children:["Si vous utilisez ",(0,o.jsx)(t.a,{href:"https://www.npmjs.com/package/axios",children:"axios"})," comme biblioth\xe8que de requ\xeates, comme dans ce tutoriel, vous n'avez rien \xe0 faire. Tout est g\xe9r\xe9 en arri\xe8re-plan."]}),"\n",(0,o.jsx)(t.p,{children:"Si vous red\xe9marrez votre serveur de d\xe9veloppement et ouvrez les outils de d\xe9veloppement de votre navigateur, vous verrez qu'axios inclut automatiquement le jeton pour vous lors de la cr\xe9ation d'un nouveau post."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"X-XSRF-Token header example",src:r(65154).A+"",width:"1928",height:"116"})})]})}function d(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},65154:(e,t,r)=>{r.d(t,{A:()=>o});const o=r.p+"assets/images/csrf-a395cf4e61edfeaa39c97b11c168dc86.png"},28453:(e,t,r)=>{r.d(t,{R:()=>i,x:()=>a});var o=r(96540);const n={},s=o.createContext(n);function i(e){const t=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),o.createElement(s.Provider,{value:t},e.children)}}}]);