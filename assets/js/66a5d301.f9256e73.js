"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3583],{49257:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var o=n(74848),i=n(28453);const r={title:"The Todo Model",id:"tuto-3-the-todo-model",slug:"3-the-todo-model"},s=void 0,a={id:"tutorials/simple-todo-list/tuto-3-the-todo-model",title:"The Todo Model",description:"The next step is to take care of the database. By default, every new project in FoalTS is configured to use an SQLite database as it does not require any additional installation.",source:"@site/versioned_docs/version-2.x/tutorials/simple-todo-list/3-the-todo-model.md",sourceDirName:"tutorials/simple-todo-list",slug:"/tutorials/simple-todo-list/3-the-todo-model",permalink:"/docs/2.x/tutorials/simple-todo-list/3-the-todo-model",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/tutorials/simple-todo-list/3-the-todo-model.md",tags:[],version:"2.x",sidebarPosition:3,frontMatter:{title:"The Todo Model",id:"tuto-3-the-todo-model",slug:"3-the-todo-model"},sidebar:"someSidebar",previous:{title:"Introduction",permalink:"/docs/2.x/tutorials/simple-todo-list/2-introduction"},next:{title:"The Shell Script create-todo",permalink:"/docs/2.x/tutorials/simple-todo-list/4-the-shell-script-create-todo"}},d={},l=[];function c(e){const t={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(t.p,{children:["The next step is to take care of the database. By default, every new project in FoalTS is configured to use an ",(0,o.jsx)(t.code,{children:"SQLite"})," database as it does not require any additional installation."]}),"\n",(0,o.jsx)(t.p,{children:"Let\u2019s start by creating your first model. The CLI provides a useful command to generate a new file with an empty model."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-sh",children:"foal generate entity todo\n"})}),"\n",(0,o.jsx)(t.admonition,{type:"info",children:(0,o.jsxs)(t.p,{children:["FoalTS uses ",(0,o.jsx)(t.a,{href:"http://typeorm.io",children:"TypeORM"})," as the default ORM in any new application. This way, you don't have to configure anything and you can start a project quickly. However, if you wish, you still can choose to ",(0,o.jsx)(t.a,{href:"/docs/2.x/databases/using-another-orm",children:"use another one"})," (",(0,o.jsx)(t.a,{href:"https://www.prisma.io/",children:"Prisma"}),", ",(0,o.jsx)(t.a,{href:"https://mikro-orm.io/",children:"MikroORM"}),", ",(0,o.jsx)(t.a,{href:"https://mongoosejs.com/",children:"Mongoose"}),", etc), as the framework code is ORM independent."]})}),"\n",(0,o.jsxs)(t.p,{children:["Open the file ",(0,o.jsx)(t.code,{children:"todo.entity.ts"})," in the ",(0,o.jsx)(t.code,{children:"src/app/entities"})," directory and add a ",(0,o.jsx)(t.code,{children:"text"})," column."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-typescript",children:"import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class Todo extends BaseEntity {\n\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column()\n  text: string;\n\n}\n\n"})}),"\n",(0,o.jsxs)(t.p,{children:["This class is the representation of the SQL table ",(0,o.jsx)(t.code,{children:"todo"}),". Currently, this table does not exist in the database. You will have to create it."]}),"\n",(0,o.jsx)(t.p,{children:"You can do this manually, using a database software for example, or use migrations, a programmatic way to update a database schema. The advantage of using migrations is that you can create, update and delete your tables directly from the definition of your entities. They also ensure that all your environments (prod, dev) and co-developers have the same table definitions."}),"\n",(0,o.jsx)(t.p,{children:"Let\u2019s see how to use them."}),"\n",(0,o.jsx)(t.p,{children:"First run the following command to generate your migration file. TypeORM will compare your current database schema with the definition of your entities and generate the appropriate SQL queries."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"npm run makemigrations\n"})}),"\n",(0,o.jsxs)(t.p,{children:["A new file appears in the ",(0,o.jsx)(t.code,{children:"src/migrations/"})," directory. Open it."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-typescript",children:'import {MigrationInterface, QueryRunner} from "typeorm";\n\nexport class migration1562755564200 implements MigrationInterface {\n\n    public async up(queryRunner: QueryRunner): Promise<void> {\n        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)`, undefined);\n        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<void> {\n        await queryRunner.query(`DROP TABLE "user"`, undefined);\n        await queryRunner.query(`DROP TABLE "todo"`, undefined);\n    }\n\n}\n\n'})}),"\n",(0,o.jsxs)(t.p,{children:["The ",(0,o.jsx)(t.code,{children:"up"})," method contains all the SQL queries that will be executed during the migration."]}),"\n",(0,o.jsx)(t.p,{children:"Then run the migration."}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"npm run migrations\n"})}),"\n",(0,o.jsx)(t.p,{children:"TypeORM examines all the migrations that have been run previously (none in this case) and executes the new ones."}),"\n",(0,o.jsxs)(t.p,{children:["Your database (",(0,o.jsx)(t.code,{children:"db.sqlite3"}),") now contains a new table named ",(0,o.jsx)(t.code,{children:"todo"}),":"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:"+------------+-----------+-------------------------------------+\n|                             todo                             |\n+------------+-----------+-------------------------------------+\n| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |\n| text       | varchar   | NOT NULL                            |\n+------------+-----------+-------------------------------------+\n"})}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsxs)(t.p,{children:["Alternatively, you can also use the ",(0,o.jsx)(t.code,{children:"synchronize"})," option in your configuration file ",(0,o.jsx)(t.code,{children:"config/default.json"}),". When set to ",(0,o.jsx)(t.code,{children:"true"}),", the database schema is auto created from the entities definition on every application launch. You do not need migrations in this case. However, although this behavior may be useful during debug and development, it is not suitable for a production environment (you could lose production data)."]}),"\n"]})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var o=n(96540);const i={},r=o.createContext(i);function s(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);