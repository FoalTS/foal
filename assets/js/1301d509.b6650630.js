"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8422],{34186:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var s=t(74848),i=t(28453);const a={title:"TypeORM",sidebar_label:"Introduction"},r=void 0,o={id:"databases/typeorm/introduction",title:"TypeORM",description:"A simple model:",source:"@site/docs/databases/typeorm/introduction.md",sourceDirName:"databases/typeorm",slug:"/databases/typeorm/introduction",permalink:"/docs/databases/typeorm/introduction",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/databases/typeorm/introduction.md",tags:[],version:"current",frontMatter:{title:"TypeORM",sidebar_label:"Introduction"},sidebar:"someSidebar",previous:{title:"ExpressJS",permalink:"/docs/common/expressjs"},next:{title:"Models & Queries",permalink:"/docs/databases/typeorm/create-models-and-queries"}},d={},l=[{value:"The ORM",id:"the-orm",level:2},{value:"Supported Databases",id:"supported-databases",level:2},{value:"Use with FoalTS",id:"use-with-foalts",level:2},{value:"Initial Configuration",id:"initial-configuration",level:3},{value:"Packages",id:"packages",level:3},{value:"Database Configuration Examples",id:"database-configuration-examples",level:2},{value:"PostgreSQL",id:"postgresql",level:3},{value:"MySQL",id:"mysql",level:3},{value:"Configuration and Testing",id:"configuration-and-testing",level:2}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"A simple model:"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class User {\n\n    @PrimaryGeneratedColumn()\n    id: number;\n\n    @Column()\n    firstName: string;\n\n    @Column()\n    lastName: string;\n\n}\n"})}),"\n",(0,s.jsx)(n.h2,{id:"the-orm",children:"The ORM"}),"\n",(0,s.jsxs)(n.p,{children:["FoalTS uses ",(0,s.jsx)(n.a,{href:"https://typeorm.io/",children:"TypeORM"})," as default ",(0,s.jsx)(n.em,{children:"Object-Relational Mapping"}),". This allows you to create classes to interact with your database tables (or collections). TypeORM is written in TypeScript and supports both ",(0,s.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Active_record_pattern",children:"Active Record"})," and ",(0,s.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Data_mapper_pattern",children:"Data Mapper"})," patterns."]}),"\n",(0,s.jsx)(n.p,{children:"Here is a non-exhaustive list of its features:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"migrations and automatic migrations generation"}),"\n",(0,s.jsx)(n.li,{children:"uni-directional, bi-directional and self-referenced relations"}),"\n",(0,s.jsx)(n.li,{children:"eager and lazy relations"}),"\n",(0,s.jsx)(n.li,{children:"TypeScript support"}),"\n",(0,s.jsx)(n.li,{children:"connection configuration in json / xml / yml / env formats"}),"\n",(0,s.jsx)(n.li,{children:"transactions"}),"\n",(0,s.jsx)(n.li,{children:"etc"}),"\n"]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Although this documentation presents the basic features of TypeORM, you may be interested in reading the ",(0,s.jsx)(n.a,{href:"https://typeorm.io/",children:"official documentation"})," to learn more advanced features."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"supported-databases",children:"Supported Databases"}),"\n",(0,s.jsx)(n.p,{children:"FoalTS supports officially the following databases:"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Database"}),(0,s.jsx)(n.th,{children:"Versions"}),(0,s.jsx)(n.th,{children:"Driver"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"PostgreSQL"}),(0,s.jsxs)(n.td,{children:["9.6+ (",(0,s.jsx)(n.a,{href:"https://www.postgresql.org/support/versioning/",children:"Version Policy"}),")"]}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"pg@8"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"MySQL"}),(0,s.jsxs)(n.td,{children:["5.7+ (",(0,s.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/MySQL#Release_history",children:"Version Policy"}),")"]}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"mysql@2"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"SQLite"}),(0,s.jsx)(n.td,{children:"3"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"sqlite3@5"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"MongoDB"}),(0,s.jsxs)(n.td,{children:["4.0+ (",(0,s.jsx)(n.a,{href:"https://www.mongodb.com/support-policy",children:"Version Policy"}),")"]}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"mongodb@5"})})]})]})]}),"\n",(0,s.jsx)(n.h2,{id:"use-with-foalts",children:"Use with FoalTS"}),"\n",(0,s.jsxs)(n.p,{children:["TypeORM is integrated by default in each new FoalTS project. This allows you to quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the page ",(0,s.jsx)(n.a,{href:"/docs/databases/other-orm/introduction",children:"Using another ORM"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"initial-configuration",children:"Initial Configuration"}),"\n",(0,s.jsxs)(n.p,{children:["When creating a new project, an ",(0,s.jsx)(n.code,{children:"SQLite"})," database is used by default as it does not require any additional installation (the data is saved in a file). The connection configuration is stored in ",(0,s.jsx)(n.code,{children:"default.json"})," located in the ",(0,s.jsx)(n.code,{children:"config/"})," directory."]}),"\n",(0,s.jsx)(n.h3,{id:"packages",children:"Packages"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm install typeorm@0.3.17 @foal/typeorm\n"})}),"\n",(0,s.jsx)(n.p,{children:"Two packages are required to use TypeORM with FoalTS:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["The package ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/typeorm",children:"typeorm"})," which is the official one of the ORM. It includes everything you need to create models and make database requests."]}),"\n",(0,s.jsxs)(n.li,{children:["The package ",(0,s.jsx)(n.a,{href:"https://www.npmjs.com/package/@foal/typeorm",children:"@foal/typeorm"})," (maintained by FoalTS) which contains additional components. These are particularly useful when using FoalTS ",(0,s.jsx)(n.a,{href:"/docs/authentication/quick-start",children:"authentication and authorization system"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"database-configuration-examples",children:"Database Configuration Examples"}),"\n",(0,s.jsx)(n.h3,{id:"postgresql",children:"PostgreSQL"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"npm install pg\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"config/default.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  // ...\n\n  "database": {\n    "type": "postgres",\n    "host": "localhost",\n    "port": 5432,\n    "username": "root",\n    "password": "password",\n    "database": "my-db"\n  }\n}\n'})}),"\n",(0,s.jsx)(n.h3,{id:"mysql",children:"MySQL"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"npm install mysql\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"config/default.json"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  // ...\n\n  "database": {\n    "type": "mysql",\n    "host": "localhost",\n    "port": 3306,\n    "username": "root",\n    "password": "password",\n    "database": "my-db"\n  }\n}\n'})}),"\n",(0,s.jsx)(n.h2,{id:"configuration-and-testing",children:"Configuration and Testing"}),"\n",(0,s.jsxs)(n.p,{children:["When running the command ",(0,s.jsx)(n.code,{children:"npm run test"})," with the above configuration, FoalTS will try to retrieve the database configuration in this order:"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"config/test.yml"})," and ",(0,s.jsx)(n.code,{children:"config/test.json"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"config/default.yml"})," and ",(0,s.jsx)(n.code,{children:"config/default.json"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["In this way, you can define a default configuration in the ",(0,s.jsx)(n.code,{children:"config/default.{yml|json}"})," file to use both during development and testing and override some settings in ",(0,s.jsx)(n.code,{children:"config/test.{yml|json}"})," during testing."]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["You learn more on how configuration works in Foal ",(0,s.jsx)(n.a,{href:"/docs/architecture/configuration",children:"here"})]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"In the example below, we add two new options:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"dropSchema"})," clears the database each time we create the connection"]}),"\n",(0,s.jsxs)(n.li,{children:["and ",(0,s.jsx)(n.code,{children:"synchronize"})," synchronizes the database tables with your entities so your do not have to generate and run migrations during testing."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"config/test.yml"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-yaml",children:"# ...\n\ndatabase:\n  username: 'test'\n  password: 'test'\n  database: 'test'\n  dropSchema: true\n  sychronize: true\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"Example of a test"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"import { DataSource } from 'typeorm';\nimport { createDataSource } from '../db';\n\ndescribe('xxx', () => {\n\n  let dataSource: DataSource;\n\n  beforeEach(async () => {\n    dataSource = createDataSource();\n    await dataSource.initialize();\n  });\n\n  afterEach(async () => {\n    if (dataSource) {\n      await dataSource.destroy()\n    }\n  });\n\n  it('yyy', () => {\n    // ...\n  });\n\n});\n"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var s=t(96540);const i={},a=s.createContext(i);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);