"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3035],{65421:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>d,toc:()=>u});var t=a(74848),s=a(28453),r=a(11470),i=a(19365);const l={title:"TypeORM",sidebar_label:"Introduction"},o=void 0,d={id:"databases/typeorm/introduction",title:"TypeORM",description:"A simple model:",source:"@site/i18n/id/docusaurus-plugin-content-docs/version-3.x/databases/typeorm/introduction.md",sourceDirName:"databases/typeorm",slug:"/databases/typeorm/introduction",permalink:"/id/docs/3.x/databases/typeorm/introduction",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-3.x/databases/typeorm/introduction.md",tags:[],version:"3.x",frontMatter:{title:"TypeORM",sidebar_label:"Introduction"},sidebar:"someSidebar",previous:{title:"ExpressJS",permalink:"/id/docs/3.x/common/expressjs"},next:{title:"Models & Queries",permalink:"/id/docs/3.x/databases/typeorm/create-models-and-queries"}},c={},u=[{value:"The ORM",id:"the-orm",level:2},{value:"Supported Databases",id:"supported-databases",level:2},{value:"Use with FoalTS",id:"use-with-foalts",level:2},{value:"Initial Configuration",id:"initial-configuration",level:3},{value:"Packages",id:"packages",level:3},{value:"Database Configuration Examples",id:"database-configuration-examples",level:2},{value:"PostgreSQL",id:"postgresql",level:3},{value:"MySQL",id:"mysql",level:3},{value:"MariaDB",id:"mariadb",level:3},{value:"Configuration and Testing",id:"configuration-and-testing",level:2}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"A simple model:"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class User {\n\n    @PrimaryGeneratedColumn()\n    id: number;\n\n    @Column()\n    firstName: string;\n\n    @Column()\n    lastName: string;\n\n}\n"})}),"\n",(0,t.jsx)(n.h2,{id:"the-orm",children:"The ORM"}),"\n",(0,t.jsxs)(n.p,{children:["FoalTS uses ",(0,t.jsx)(n.a,{href:"https://typeorm.io/",children:"TypeORM"})," as default ",(0,t.jsx)(n.em,{children:"Object-Relational Mapping"}),". This allows you to create classes to interact with your database tables (or collections). TypeORM is written in TypeScript and supports both ",(0,t.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Active_record_pattern",children:"Active Record"})," and ",(0,t.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Data_mapper_pattern",children:"Data Mapper"})," patterns."]}),"\n",(0,t.jsx)(n.p,{children:"Here is a non-exhaustive list of its features:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"migrations and automatic migrations generation"}),"\n",(0,t.jsx)(n.li,{children:"uni-directional, bi-directional and self-referenced relations"}),"\n",(0,t.jsx)(n.li,{children:"eager and lazy relations"}),"\n",(0,t.jsx)(n.li,{children:"TypeScript support"}),"\n",(0,t.jsx)(n.li,{children:"connection configuration in json / xml / yml / env formats"}),"\n",(0,t.jsx)(n.li,{children:"transactions"}),"\n",(0,t.jsx)(n.li,{children:"etc"}),"\n"]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Although this documentation presents the basic features of TypeORM, you may be interested in reading the ",(0,t.jsx)(n.a,{href:"https://typeorm.io/",children:"official documentation"})," to learn more advanced features."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"supported-databases",children:"Supported Databases"}),"\n",(0,t.jsx)(n.p,{children:"FoalTS supports officially the following databases:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Database"}),(0,t.jsx)(n.th,{children:"Versions"}),(0,t.jsx)(n.th,{children:"Driver"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"PostgreSQL"}),(0,t.jsxs)(n.td,{children:["9.6+ (",(0,t.jsx)(n.a,{href:"https://www.postgresql.org/support/versioning/",children:"Version Policy"}),")"]}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"pg@8"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"MySQL"}),(0,t.jsxs)(n.td,{children:["5.7+ (",(0,t.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/MySQL#Release_history",children:"Version Policy"}),")"]}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"mysql@2"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"MariaDB"}),(0,t.jsxs)(n.td,{children:["10.2+ (",(0,t.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/MariaDB#Versioning",children:"Version Policy"}),")"]}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"mysql@2"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"SQLite"}),(0,t.jsx)(n.td,{children:"3"}),(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"sqlite3@5"})," and ",(0,t.jsx)(n.code,{children:"better-sqlite3@7"})," (since v2.1)"]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"MongoDB"}),(0,t.jsxs)(n.td,{children:["4.0+ (",(0,t.jsx)(n.a,{href:"https://www.mongodb.com/support-policy",children:"Version Policy"}),")"]}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"mongodb@3"})})]})]})]}),"\n",(0,t.jsx)(n.h2,{id:"use-with-foalts",children:"Use with FoalTS"}),"\n",(0,t.jsxs)(n.p,{children:["TypeORM is integrated by default in each new FoalTS project. This allows you to quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the page ",(0,t.jsx)(n.a,{href:"/id/docs/3.x/databases/other-orm/introduction",children:"Using another ORM"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"initial-configuration",children:"Initial Configuration"}),"\n",(0,t.jsxs)(n.p,{children:["When creating a new project, an ",(0,t.jsx)(n.code,{children:"SQLite"})," database is used by default as it does not require any additional installation (the data is saved in a file). The connection configuration is stored in ",(0,t.jsx)(n.code,{children:"default.json"})," located in the ",(0,t.jsx)(n.code,{children:"config/"})," directory."]}),"\n",(0,t.jsx)(n.h3,{id:"packages",children:"Packages"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"npm install typeorm @foal/typeorm\n"})}),"\n",(0,t.jsx)(n.p,{children:"Two packages are required to use TypeORM with FoalTS:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["The package ",(0,t.jsx)(n.a,{href:"https://www.npmjs.com/package/typeorm",children:"typeorm"})," which is the official one of the ORM. It includes everything you need to create models and make database requests."]}),"\n",(0,t.jsxs)(n.li,{children:["The package ",(0,t.jsx)(n.a,{href:"https://www.npmjs.com/package/@foal/typeorm",children:"@foal/typeorm"})," (maintained by FoalTS) which contains additional components. These are particularly useful when using FoalTS ",(0,t.jsx)(n.a,{href:"/id/docs/3.x/authentication/quick-start",children:"authentication and authorization system"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"database-configuration-examples",children:"Database Configuration Examples"}),"\n",(0,t.jsx)(n.h3,{id:"postgresql",children:"PostgreSQL"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"npm install pg\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"config/default.{json|yml|js}"})}),"\n",(0,t.jsxs)(r.A,{defaultValue:"yaml",values:[{label:"YAML",value:"yaml"},{label:"JSON",value:"json"},{label:"JS",value:"js"}],children:[(0,t.jsx)(i.A,{value:"yaml",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\n\ndatabase:\n  type: postgres\n  host: localhost\n  port: 5432\n  username: root\n  password: password\n  database: my-db\n"})})}),(0,t.jsx)(i.A,{value:"json",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  // ...\n\n  "database": {\n    "type": "postgres",\n    "host": "localhost",\n    "port": 5432,\n    "username": "root",\n    "password": "password",\n    "database": "my-db"\n  }\n}\n'})})}),(0,t.jsx)(i.A,{value:"js",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:'module.exports = {\n  // ...\n\n  database: {\n    type: "postgres",\n    host: "localhost",\n    port: 5432,\n    username: "root",\n    password: "password",\n    database: "my-db"\n  }\n}\n'})})})]}),"\n",(0,t.jsx)(n.h3,{id:"mysql",children:"MySQL"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"npm install mysql\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"config/default.{json|yml|js}"})}),"\n",(0,t.jsxs)(r.A,{defaultValue:"yaml",values:[{label:"YAML",value:"yaml"},{label:"JSON",value:"json"},{label:"JS",value:"js"}],children:[(0,t.jsx)(i.A,{value:"yaml",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\n\ndatabase:\n  type: mysql\n  host: localhost\n  port: 3306\n  username: root\n  password: password\n  database: my-db\n"})})}),(0,t.jsx)(i.A,{value:"json",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  // ...\n\n  "database": {\n    "type": "mysql",\n    "host": "localhost",\n    "port": 3306,\n    "username": "root",\n    "password": "password",\n    "database": "my-db"\n  }\n}\n'})})}),(0,t.jsx)(i.A,{value:"js",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:'module.exports = {\n  // ...\n\n  database: {\n    type: "mysql",\n    host: "localhost",\n    port: 3306,\n    username: "root",\n    password: "password",\n    database: "my-db"\n  }\n}\n'})})})]}),"\n",(0,t.jsx)(n.h3,{id:"mariadb",children:"MariaDB"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"npm install mysql\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"config/default.{json|yml|js}"})}),"\n",(0,t.jsxs)(r.A,{defaultValue:"yaml",values:[{label:"YAML",value:"yaml"},{label:"JSON",value:"json"},{label:"JS",value:"js"}],children:[(0,t.jsx)(i.A,{value:"yaml",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\n\ndatabase:\n  type: mariadb\n  host: localhost\n  port: 3306\n  username: root\n  password: password\n  database: my-db\n"})})}),(0,t.jsx)(i.A,{value:"json",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  // ...\n\n  "database": {\n    "type": "mariadb",\n    "host": "localhost",\n    "port": 3306,\n    "username": "root",\n    "password": "password",\n    "database": "my-db"\n  }\n}\n'})})}),(0,t.jsx)(i.A,{value:"js",children:(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:'module.exports = {\n  // ...\n\n  database: {\n    type: "mariadb",\n    host: "localhost",\n    port: 3306,\n    username: "root",\n    password: "password",\n    database: "my-db"\n  }\n}\n'})})})]}),"\n",(0,t.jsx)(n.h2,{id:"configuration-and-testing",children:"Configuration and Testing"}),"\n",(0,t.jsxs)(n.p,{children:["When running the command ",(0,t.jsx)(n.code,{children:"npm run test"})," with the above configuration, FoalTS will try to retrieve the database configuration in this order:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"config/test.yml"})," and ",(0,t.jsx)(n.code,{children:"config/test.json"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"config/default.yml"})," and ",(0,t.jsx)(n.code,{children:"config/default.json"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["In this way, you can define a default configuration in the ",(0,t.jsx)(n.code,{children:"config/default.{yml|json}"})," file to use both during development and testing and override some settings in ",(0,t.jsx)(n.code,{children:"config/test.{yml|json}"})," during testing."]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["You learn more on how configuration works in Foal ",(0,t.jsx)(n.a,{href:"/id/docs/3.x/architecture/configuration",children:"here"})]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"In the example below, we add two new options:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"dropSchema"})," clears the database each time we create the connection"]}),"\n",(0,t.jsxs)(n.li,{children:["and ",(0,t.jsx)(n.code,{children:"synchronize"})," synchronizes the database tables with your entities so your do not have to generate and run migrations during testing."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"config/test.yml"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"# ...\n\ndatabase:\n  username: 'test'\n  password: 'test'\n  database: 'test'\n  dropSchema: true\n  sychronize: true\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.em,{children:"Example of a test"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { DataSource } from 'typeorm';\nimport { createDataSource } from '../db';\n\ndescribe('xxx', () => {\n\n  let dataSource: DataSource;\n\n  beforeEach(async () => {\n    dataSource = createDataSource();\n    await dataSource.initialize();\n  });\n\n  afterEach(async () => {\n    if (dataSource) {\n      await dataSource.destroy()\n    }\n  });\n\n  it('yyy', () => {\n    // ...\n  });\n\n});\n"})})]})}function p(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},19365:(e,n,a)=>{a.d(n,{A:()=>i});a(96540);var t=a(34164);const s={tabItem:"tabItem_Ymn6"};var r=a(74848);function i(e){let{children:n,hidden:a,className:i}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,t.A)(s.tabItem,i),hidden:a,children:n})}},11470:(e,n,a)=>{a.d(n,{A:()=>w});var t=a(96540),s=a(34164),r=a(23104),i=a(56347),l=a(205),o=a(57485),d=a(31682),c=a(89466);function u(e){return t.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,t.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:a}=e;return(0,t.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:a,attributes:t,default:s}}=e;return{value:n,label:a,attributes:t,default:s}}))}(a);return function(e){const n=(0,d.X)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,a])}function p(e){let{value:n,tabValues:a}=e;return a.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:a}=e;const s=(0,i.W6)(),r=function(e){let{queryString:n=!1,groupId:a}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:n,groupId:a});return[(0,o.aZ)(r),(0,t.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(s.location.search);n.set(r,e),s.replace({...s.location,search:n.toString()})}),[r,s])]}function j(e){const{defaultValue:n,queryString:a=!1,groupId:s}=e,r=h(e),[i,o]=(0,t.useState)((()=>function(e){let{defaultValue:n,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const t=a.find((e=>e.default))??a[0];if(!t)throw new Error("Unexpected error: 0 tabValues");return t.value}({defaultValue:n,tabValues:r}))),[d,u]=m({queryString:a,groupId:s}),[j,x]=function(e){let{groupId:n}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(n),[s,r]=(0,c.Dv)(a);return[s,(0,t.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:s}),b=(()=>{const e=d??j;return p({value:e,tabValues:r})?e:null})();(0,l.A)((()=>{b&&o(b)}),[b]);return{selectedValue:i,selectValue:(0,t.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),x(e)}),[u,x,r]),tabValues:r}}var x=a(92303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var f=a(74848);function g(e){let{className:n,block:a,selectedValue:t,selectValue:i,tabValues:l}=e;const o=[],{blockElementScrollPositionUntilNextRender:d}=(0,r.a_)(),c=e=>{const n=e.currentTarget,a=o.indexOf(n),s=l[a].value;s!==t&&(d(n),i(s))},u=e=>{let n=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=o.indexOf(e.currentTarget)+1;n=o[a]??o[0];break}case"ArrowLeft":{const a=o.indexOf(e.currentTarget)-1;n=o[a]??o[o.length-1];break}}n?.focus()};return(0,f.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.A)("tabs",{"tabs--block":a},n),children:l.map((e=>{let{value:n,label:a,attributes:r}=e;return(0,f.jsx)("li",{role:"tab",tabIndex:t===n?0:-1,"aria-selected":t===n,ref:e=>o.push(e),onKeyDown:u,onClick:c,...r,className:(0,s.A)("tabs__item",b.tabItem,r?.className,{"tabs__item--active":t===n}),children:a??n},n)}))})}function y(e){let{lazy:n,children:a,selectedValue:s}=e;const r=(Array.isArray(a)?a:[a]).filter(Boolean);if(n){const e=r.find((e=>e.props.value===s));return e?(0,t.cloneElement)(e,{className:"margin-top--md"}):null}return(0,f.jsx)("div",{className:"margin-top--md",children:r.map(((e,n)=>(0,t.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function v(e){const n=j(e);return(0,f.jsxs)("div",{className:(0,s.A)("tabs-container",b.tabList),children:[(0,f.jsx)(g,{...e,...n}),(0,f.jsx)(y,{...e,...n})]})}function w(e){const n=(0,x.A)();return(0,f.jsx)(v,{...e,children:u(e.children)},String(n))}},28453:(e,n,a)=>{a.d(n,{R:()=>i,x:()=>l});var t=a(96540);const s={},r=t.createContext(s);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);