"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6760],{61541:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>c,toc:()=>l});var t=o(74848),a=o(28453);const r={title:"Protecci\xf3n contra CSRF",id:"tuto-13-csrf",slug:"13-csrf"},i=void 0,c={id:"tutorials/real-world-example-with-react/tuto-13-csrf",title:"Protecci\xf3n contra CSRF",description:"Dado que utiliza la autenticaci\xf3n con cookies, necesita a\xf1adir protecci\xf3n CSRF a su aplicaci\xf3n. Esto es realmente f\xe1cil con Foal, incluso cuando se construye un SPA.",source:"@site/i18n/es/docusaurus-plugin-content-docs/version-3.x/tutorials/real-world-example-with-react/13-csrf.md",sourceDirName:"tutorials/real-world-example-with-react",slug:"/tutorials/real-world-example-with-react/13-csrf",permalink:"/es/docs/3.x/tutorials/real-world-example-with-react/13-csrf",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-3.x/tutorials/real-world-example-with-react/13-csrf.md",tags:[],version:"3.x",sidebarPosition:13,frontMatter:{title:"Protecci\xf3n contra CSRF",id:"tuto-13-csrf",slug:"13-csrf"},sidebar:"someSidebar",previous:{title:"Carga y Descarga de Im\xe1genes",permalink:"/es/docs/3.x/tutorials/real-world-example-with-react/12-file-upload"},next:{title:"Construcci\xf3n de Producci\xf3n",permalink:"/es/docs/3.x/tutorials/real-world-example-with-react/14-production-build"}},s={},l=[];function d(e){const n={a:"a",code:"code",img:"img",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Dado que utiliza la autenticaci\xf3n con cookies, necesita a\xf1adir protecci\xf3n CSRF a su aplicaci\xf3n. Esto es realmente f\xe1cil con Foal, incluso cuando se construye un SPA."}),"\n",(0,t.jsxs)(n.p,{children:["Abra el archivo de configuraci\xf3n ",(0,t.jsx)(n.code,{children:"default.json"})," y habilite la protecci\xf3n CSRF."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "port": "env(PORT)",\n  "settings": {\n    "session": {\n      "store": "@foal/typeorm",\n      "csrf": {\n        "enabled": true\n      }\n    },\n    ...\n  }\n  ...\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Ahora, al utilizar sesiones con cookies, el servidor enviar\xe1 un token adicional al cliente en una cookie denominada ",(0,t.jsx)(n.code,{children:"XSRF-Token"}),". Este token tendr\xe1 que ser recuperado por la aplicaci\xf3n front-end y enviado de vuelta en cada petici\xf3n POST, PATCH, PUT y DELETE posterior con la cabecera ",(0,t.jsx)(n.code,{children:"X-XSRF-Token"}),". Si no es as\xed, el servidor devolver\xe1 un error 403."]}),"\n",(0,t.jsxs)(n.p,{children:["Si utiliza ",(0,t.jsx)(n.a,{href:"https://www.npmjs.com/package/axios",children:"axios"})," como su biblioteca de peticiones, como en este tutorial, no tiene que hacer nada. Todo se maneja en segundo plano."]}),"\n",(0,t.jsx)(n.p,{children:"Si reinicia su servidor de desarrollo y abre las herramientas de desarrollo de su navegador, ver\xe1 que axios incluye autom\xe1ticamente el token por usted al crear una nueva publicaci\xf3n."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"X-XSRF-Token header example",src:o(95927).A+"",width:"1928",height:"116"})})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},95927:(e,n,o)=>{o.d(n,{A:()=>t});const t=o.p+"assets/images/csrf-a395cf4e61edfeaa39c97b11c168dc86.png"},28453:(e,n,o)=>{o.d(n,{R:()=>i,x:()=>c});var t=o(96540);const a={},r=t.createContext(a);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);