"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4012],{85982:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>c,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var s=n(74848),t=n(28453);const o={title:"Base de Datos (configuraci\xf3n)",id:"tuto-2-database-set-up",slug:"2-database-set-up"},r=void 0,i={id:"tutorials/real-world-example-with-react/tuto-2-database-set-up",title:"Base de Datos (configuraci\xf3n)",description:"El primer paso de este tutorial es establecer una conexi\xf3n con la base de datos. Si a\xfan no lo ha hecho, instale MySQL o PostgreSQL.",source:"@site/i18n/es/docusaurus-plugin-content-docs/current/tutorials/real-world-example-with-react/2-database-set-up.md",sourceDirName:"tutorials/real-world-example-with-react",slug:"/tutorials/real-world-example-with-react/2-database-set-up",permalink:"/es/docs/tutorials/real-world-example-with-react/2-database-set-up",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/tutorials/real-world-example-with-react/2-database-set-up.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Base de Datos (configuraci\xf3n)",id:"tuto-2-database-set-up",slug:"2-database-set-up"},sidebar:"someSidebar",previous:{title:"Introducci\xf3n",permalink:"/es/docs/tutorials/real-world-example-with-react/1-introduction"},next:{title:"Los Modelos User y Story",permalink:"/es/docs/tutorials/real-world-example-with-react/3-the-models"}},c={},l=[];function d(e){const a={a:"a",blockquote:"blockquote",code:"code",em:"em",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(a.p,{children:["El primer paso de este tutorial es establecer una conexi\xf3n con la base de datos. Si a\xfan no lo ha hecho, instale ",(0,s.jsx)(a.a,{href:"https://dev.mysql.com/downloads/",children:"MySQL"})," o ",(0,s.jsx)(a.a,{href:"https://www.postgresql.org/download/",children:"PostgreSQL"}),"."]}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.em,{children:"Por defecto, Foal utiliza SQLite en cada nueva aplicaci\xf3n, ya que no requiere ninguna instalaci\xf3n. Si quiere seguir utiliz\xe1ndolo en este tutorial, puede saltarse esta secci\xf3n y pasar a la siguiente p\xe1gina."})}),"\n"]}),"\n",(0,s.jsx)(a.p,{children:"Primero, instale el controlador de MySQL (o Postgres)."}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-bash",children:"npm install mysql # or pg\n"})}),"\n",(0,s.jsxs)(a.p,{children:["Abra el archivo ",(0,s.jsx)(a.code,{children:"config/default.json"})," y actualice la secci\xf3n ",(0,s.jsx)(a.code,{children:"database"})," como sigue. Si su base de datos es PostgreSQL, cambie el valor de ",(0,s.jsx)(a.code,{children:"type"})," a ",(0,s.jsx)(a.code,{children:"postgres"}),"."]}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-json",children:'{\n  "port": "env(PORT)",\n  "settings": {\n    ...\n  },\n  "database": {\n    "type": "mysql",\n    "host": "env(DB_HOST)",\n    "port": "env(DB_PORT)",\n    "username": "env(DB_USERNAME)",\n    "password": "env(DB_PASSWORD)",\n    "database": "env(DB_NAME)"\n  }\n}\n\n'})}),"\n",(0,s.jsx)(a.p,{children:"Este archivo es el archivo de configuraci\xf3n principal de la aplicaci\xf3n y se utiliza como base para cualquier entorno en el que se ejecute la aplicaci\xf3n."}),"\n",(0,s.jsxs)(a.p,{children:["La sintaxis ",(0,s.jsx)(a.code,{children:"env(*)"})," indica al sistema de configuraci\xf3n que debe leer el valor de la variable de entorno dada. Si no existe, Foal intentar\xe1 leerlo de un archivo ",(0,s.jsx)(a.code,{children:".env"}),"."]}),"\n",(0,s.jsxs)(a.p,{children:["Cree un nuevo archivo ",(0,s.jsx)(a.code,{children:".env"})," en la ra\xedz de ",(0,s.jsx)(a.code,{children:"backend-app"})," y proporcione las credenciales de la base de datos."]}),"\n",(0,s.jsx)(a.p,{children:(0,s.jsx)(a.em,{children:".env"})}),"\n",(0,s.jsx)(a.pre,{children:(0,s.jsx)(a.code,{className:"language-bash",children:'# Use the identification information of your database.\n# The values below are given as an example.\nDB_HOST="localhost"\n# Default port for PostgreSQL is 5432.\nDB_PORT="3306"\nDB_USERNAME="test"\nDB_PASSWORD="test"\nDB_NAME="test"\n'})}),"\n",(0,s.jsx)(a.p,{children:"Reinicie el servidor de desarrollo. La aplicaci\xf3n est\xe1 ahora conectada a su base de datos."}),"\n",(0,s.jsxs)(a.blockquote,{children:["\n",(0,s.jsxs)(a.p,{children:["Podr\xeda haber especificado todas las opciones de conexi\xf3n a la base de datos directamente en el archivo ",(0,s.jsx)(a.code,{children:"default.json"})," pero esto se considera una mala pr\xe1ctica."]}),"\n",(0,s.jsxs)(a.p,{children:["Los archivos de configuraci\xf3n se suelen ",(0,s.jsx)(a.em,{children:"commitar"})," en el control de versiones y se recomienda no ",(0,s.jsx)(a.em,{children:"commitar"})," archivos que contengan informaci\xf3n sensible."]}),"\n"]})]})}function u(e={}){const{wrapper:a}={...(0,t.R)(),...e.components};return a?(0,s.jsx)(a,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},28453:(e,a,n)=>{n.d(a,{R:()=>r,x:()=>i});var s=n(96540);const t={},o=s.createContext(t);function r(e){const a=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function i(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(o.Provider,{value:a},e.children)}}}]);