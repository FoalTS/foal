(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7474],{3905:function(e,n,t){"use strict";t.d(n,{Zo:function(){return m},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},m=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},c=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=l(t),d=i,f=c["".concat(s,".").concat(d)]||c[d]||u[d]||a;return t?r.createElement(f,o(o({ref:n},m),{},{components:t})):r.createElement(f,o({ref:n},m))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=c;var p={};for(var s in n)hasOwnProperty.call(n,s)&&(p[s]=n[s]);p.originalType=e,p.mdxType="string"==typeof e?e:i,o[1]=p;for(var l=2;l<a;l++)o[l]=t[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}c.displayName="MDXCreateElement"},9044:function(e,n,t){"use strict";t.r(n),t.d(n,{frontMatter:function(){return p},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return m},default:function(){return c}});var r=t(2122),i=t(9756),a=(t(7294),t(3905)),o=["components"],p={title:"Simplified CLI Commands"},s=void 0,l={unversionedId:"upgrade-to-v2/cli-commands",id:"upgrade-to-v2/cli-commands",isDocsHomePage:!1,title:"Simplified CLI Commands",description:"Script and migration commands were tedious to use in version 1 of Foal. They were many different commands to use in a special order to make things work. In version 2, commands have been reduced, simplified and are now more intuitive.",source:"@site/i18n/id/docusaurus-plugin-content-docs/current/upgrade-to-v2/cli-commands.md",sourceDirName:"upgrade-to-v2",slug:"/upgrade-to-v2/cli-commands",permalink:"/id/docs/upgrade-to-v2/cli-commands",editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/upgrade-to-v2/cli-commands.md",version:"current",frontMatter:{title:"Simplified CLI Commands"}},m=[{value:"Steps to upgrade",id:"steps-to-upgrade",children:[]},{value:"Examples",id:"examples",children:[]}],u={toc:m};function c(e){var n=e.components,t=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Script and migration commands were tedious to use in version 1 of Foal. They were many different commands to use in a special order to make things work. In version 2, commands have been reduced, simplified and are now more intuitive."),(0,a.kt)("p",null,"In version 2, the application, scripts and migrations are built with one single command: ",(0,a.kt)("inlineCode",{parentName:"p"},"npm run build"),"."),(0,a.kt)("p",null,"If you are in development and want to start the build in watch mode, you can use ",(0,a.kt)("inlineCode",{parentName:"p"},"npm run develop"),". This will also start the server."),(0,a.kt)("p",null,"If you're coding shell scripts, you can execute ",(0,a.kt)("inlineCode",{parentName:"p"},"npm run develop")," in one terminal and ",(0,a.kt)("inlineCode",{parentName:"p"},"foal run <my-script>")," in another. This will re-compile your scripts when you save them without the need of calling ",(0,a.kt)("inlineCode",{parentName:"p"},"npm run build")," each time."),(0,a.kt)("p",null,"Regarding migrations, you now have only three commands to use and you don't have to take care anymore of the build part or the emptying of the target directory of the build."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"npm run makemigrations\nnpm run migrations\nnpm run revertmigration\n")),(0,a.kt)("h2",{id:"steps-to-upgrade"},"Steps to upgrade"),(0,a.kt)("p",null,"Here are the steps to upgrade to version 2:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Remove the files ",(0,a.kt)("inlineCode",{parentName:"p"},"tsconfig.migrations.json")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"tsconfig.scripts.json"),".")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Replace the content of the file ",(0,a.kt)("inlineCode",{parentName:"p"},"tsconfig.app.json")," with this:"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "extends": "./tsconfig.json",\n  "include": [\n    "src/**/*.ts"\n  ],\n  "exclude": [\n    "src/e2e/*.ts",\n    "src/**/*.spec.ts",\n    "src/e2e.ts",\n    "src/test.ts"\n  ]\n}\n'))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Replace the commands of your ",(0,a.kt)("inlineCode",{parentName:"p"},"package.json")," with the ones below. You can also uninstall the ",(0,a.kt)("inlineCode",{parentName:"p"},"copy")," package."),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "scripts": {\n    "build": "foal rmdir build && tsc -p tsconfig.app.json",\n    "start": "node ./build/index.js",\n    "develop": "npm run build && concurrently \\"tsc -p tsconfig.app.json -w\\" \\"supervisor -w ./build --no-restart-on error ./build/index.js\\"",\n\n    "build:test": "foal rmdir build && tsc -p tsconfig.test.json",\n    "start:test": "mocha --file ./build/test.js \\"./build/**/*.spec.js\\"",\n    "test": "npm run build:test && concurrently \\"tsc -p tsconfig.test.json -w\\" \\"mocha --file ./build/test.js -w \\\\\\"./build/**/*.spec.js\\\\\\"\\"",\n\n    "build:e2e": "foal rmdir build && tsc -p tsconfig.e2e.json",\n    "start:e2e": "mocha --file ./build/e2e.js \\"./build/e2e/**/*.js\\"",\n    "e2e": "npm run build:e2e && concurrently \\"tsc -p tsconfig.e2e.json -w\\" \\"mocha --file ./build/e2e.js -w \\\\\\"./build/e2e/**/*.js\\\\\\"\\"",\n\n    "lint": "eslint --ext ts src",\n    "lint:fix": "eslint --ext ts --fix src",\n\n    "makemigrations": "foal rmdir build && tsc -p tsconfig.app.json && npx typeorm migration:generate --name migration && tsc -p tsconfig.app.json",\n    "migrations": "npx typeorm migration:run",\n    "revertmigration": "npx typeorm migration:revert"\n  }\n}\n')))),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Note: If your HTML templates are located in your ",(0,a.kt)("inlineCode",{parentName:"em"},"src/")," directory you still will need the ",(0,a.kt)("inlineCode",{parentName:"em"},"copy"),' package and to keep the `copy-cli \\"src/**/'),'.html\\" build',(0,a.kt)("inlineCode",{parentName:"p"},"part in your"),"package.json`.*"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Build, make and run migrations")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Version 1\nnpm run build:app\nnpm run migration:generate -- -n my_migration\nnpm run build:migrations\nnpm run migration:run\n\n# Version 2\nnpm run makemigrations\nnpm run migrations\n")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Build and run scripts in watch mode (development)")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Version 1\nnpm run build:scripts && foal run my-script\n\n# Version 2\n# In one terminal:\nnpm run develop\n\n# In another terminal:\nfoal run my-script\n")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Revert one migration")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Version 1\nnpm run migration:revert\n\n# Version 2\nnpm run revertmigration\n")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Build migrations, scripts and the app")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# Version 1\nnpm run build:app\nnpm run build:scripts\nnpm run build:migrations\n\n# Version 2\nnpm run build\n")))}c.isMDXComponent=!0}}]);