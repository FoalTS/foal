"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[68],{77320:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>a});var o=t(74848),s=t(28453);const r={title:"The User & Todo Models"},i=void 0,d={id:"tutorials/multi-user-todo-list/tuto-2-the-user-and-todo-models",title:"The User & Todo Models",description:"First of all, if you have downloaded the source code of the previous tutorial, compile and run the existing migrations.",source:"@site/versioned_docs/version-1.x/tutorials/multi-user-todo-list/tuto-2-the-user-and-todo-models.md",sourceDirName:"tutorials/multi-user-todo-list",slug:"/tutorials/multi-user-todo-list/tuto-2-the-user-and-todo-models",permalink:"/es/docs/1.x/tutorials/multi-user-todo-list/tuto-2-the-user-and-todo-models",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-1.x/tutorials/multi-user-todo-list/tuto-2-the-user-and-todo-models.md",tags:[],version:"1.x",frontMatter:{title:"The User & Todo Models"},sidebar:"someSidebar",previous:{title:"Introduction",permalink:"/es/docs/1.x/tutorials/multi-user-todo-list/tuto-1-Introduction"},next:{title:"The Shell Scripts",permalink:"/es/docs/1.x/tutorials/multi-user-todo-list/tuto-3-the-shell-scripts"}},l={},a=[{value:"The User Model",id:"the-user-model",level:2},{value:"The Todo Model",id:"the-todo-model",level:2},{value:"The Migrations",id:"the-migrations",level:2}];function c(e){const n={code:"code",h2:"h2",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:"First of all, if you have downloaded the source code of the previous tutorial, compile and run the existing migrations."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm run build:migrations\nnpm run migration:run\n"})}),"\n",(0,o.jsx)(n.h2,{id:"the-user-model",children:"The User Model"}),"\n",(0,o.jsxs)(n.p,{children:["Then open the ",(0,o.jsx)(n.code,{children:"user.entity.ts"})," file from the ",(0,o.jsx)(n.code,{children:"src/app/entities"})," directory. The ",(0,o.jsx)(n.code,{children:"User"})," entity is the main class used by the framework's authentication system."]}),"\n",(0,o.jsxs)(n.p,{children:["Add the ",(0,o.jsx)(n.code,{children:"email"})," and ",(0,o.jsx)(n.code,{children:"password"})," properties and the ",(0,o.jsx)(n.code,{children:"setPassword"})," method."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import { hashPassword } from '@foal/core';\nimport { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class User {\n\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column({ unique: true })\n  email: string;\n\n  @Column()\n  password: string;\n\n  async setPassword(password: string) {\n    this.password = await hashPassword(password);\n  }\n\n}\n\n"})}),"\n",(0,o.jsxs)(n.p,{children:["The ",(0,o.jsx)(n.code,{children:"setPassword"})," method uses ",(0,o.jsx)(n.code,{children:"hashPassword"})," to hash passwords before storing them in the database. You must use this method to set a password instead of directly assigning a value to the ",(0,o.jsx)(n.code,{children:"password"})," attribute."]}),"\n",(0,o.jsx)(n.h2,{id:"the-todo-model",children:"The Todo Model"}),"\n",(0,o.jsxs)(n.p,{children:["The Todo model defined in the previous tutorial now needs a ",(0,o.jsx)(n.code,{children:"owner"})," property to know which user it belongs to."]}),"\n",(0,o.jsxs)(n.p,{children:["Replace the content of ",(0,o.jsx)(n.code,{children:"todo.entity.ts"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:"import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';\nimport { User } from './user.entity';\n\n@Entity()\nexport class Todo {\n\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column()\n  text: string;\n\n  @ManyToOne(type => User)\n  owner: User;\n\n}\n\n"})}),"\n",(0,o.jsxs)(n.p,{children:["In the database the ",(0,o.jsx)(n.code,{children:"todo"})," table will look like this:"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"+------------+-----------+-------------------------------------+\n|                             todo                             |\n+------------+-----------+-------------------------------------+\n| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |\n| text       | varchar   | NOT NULL                            |\n| ownerId    | integer   |                                     |\n+------------+-----------+-------------------------------------+\n"})}),"\n",(0,o.jsx)(n.h2,{id:"the-migrations",children:"The Migrations"}),"\n",(0,o.jsx)(n.p,{children:"The last step is to create/update the tables in the database. As in the first tutorial, you will use migrations for this."}),"\n",(0,o.jsx)(n.p,{children:"Build the application."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm run build:app\n"})}),"\n",(0,o.jsx)(n.p,{children:"Generate the migrations from the entities."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm run migration:generate -- --name=user-and-todo\n"})}),"\n",(0,o.jsxs)(n.p,{children:["A new file is added in ",(0,o.jsx)(n.code,{children:"src/migrations"}),"."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'import {MigrationInterface, QueryRunner} from "typeorm";\n\nexport class userAndTodo1562765487944 implements MigrationInterface {\n\n    public async up(queryRunner: QueryRunner): Promise<void> {\n        // SQL queries...\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<void> {\n        // SQL queries...\n    }\n\n}\n'})}),"\n",(0,o.jsx)(n.p,{children:"Then build and run the new migration file."}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm run build:migrations\nnpm run migration:run\n"})})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>d});var o=t(96540);const s={},r=o.createContext(s);function i(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);