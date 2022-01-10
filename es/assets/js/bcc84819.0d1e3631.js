(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1177],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=d(n),m=o,f=u["".concat(l,".").concat(m)]||u[m]||p[m]||r;return n?a.createElement(f,i(i({ref:t},c),{},{components:n})):a.createElement(f,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var d=2;d<r;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8882:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return c},default:function(){return u}});var a=n(2122),o=n(9756),r=(n(7294),n(3905)),i=["components"],s={title:"Validaci\xf3n & Sanitizaci\xf3n",id:"tuto-6-validation-and-sanitization",slug:"6-validation-and-sanitization"},l=void 0,d={unversionedId:"tutorials/simple-todo-list/tuto-6-validation-and-sanitization",id:"tutorials/simple-todo-list/tuto-6-validation-and-sanitization",isDocsHomePage:!1,title:"Validaci\xf3n & Sanitizaci\xf3n",description:"Actualmente las entradas recibidas por el servidor no se comprueban. Todo el mundo puede enviar cualquier cosa al solicitar POST /api/todos. Por eso no se puede confiar en las entradas del cliente.",source:"@site/i18n/es/docusaurus-plugin-content-docs/current/tutorials/simple-todo-list/6-validation-and-sanitization.md",sourceDirName:"tutorials/simple-todo-list",slug:"/tutorials/simple-todo-list/6-validation-and-sanitization",permalink:"/es/docs/tutorials/simple-todo-list/6-validation-and-sanitization",editUrl:"https://github.com/FoalTS/foal/edit/master/docs/docs/tutorials/simple-todo-list/6-validation-and-sanitization.md",version:"current",sidebarPosition:6,frontMatter:{title:"Validaci\xf3n & Sanitizaci\xf3n",id:"tuto-6-validation-and-sanitization",slug:"6-validation-and-sanitization"},sidebar:"someSidebar",previous:{title:"La API REST",permalink:"/es/docs/tutorials/simple-todo-list/5-the-rest-api"},next:{title:"Pruebas Unitarias",permalink:"/es/docs/tutorials/simple-todo-list/7-unit-testing"}},c=[],p={toc:c};function u(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Actualmente las entradas recibidas por el servidor no se comprueban. Todo el mundo puede enviar cualquier cosa al solicitar ",(0,r.kt)("inlineCode",{parentName:"p"},"POST /api/todos"),". Por eso no se puede confiar en las entradas del cliente."),(0,r.kt)("p",null,"Utilizar\xe1 los hooks ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateBody")," y ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidatePathParam")," para validar y sanear los datos entrantes."),(0,r.kt)("p",null,"Un ",(0,r.kt)("em",{parentName:"p"},"hook")," es un decorador que se adjunta a un gestor de rutas (un m\xe9todo del controlador). Se ejecuta antes del m\xe9todo y, por tanto, es especialmente adecuado para la validaci\xf3n o el control de acceso."),(0,r.kt)("p",null,"El ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidateBody")," y el ",(0,r.kt)("inlineCode",{parentName:"p"},"ValidatePathParam")," comprueban respectivamente las propiedades ",(0,r.kt)("inlineCode",{parentName:"p"},"body")," y ",(0,r.kt)("inlineCode",{parentName:"p"},"params")," del objeto de petici\xf3n. Toman un esquema como \xfanico argumento."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"FoalTS utiliza ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/epoberezkin/ajv"},"Ajv"),", un r\xe1pido validador de esquemas JSON, para definir sus esquemas.")),(0,r.kt)("p",null,"Vamos a a\xf1adir validaci\xf3n y sanitizaci\xf3n a su aplicaci\xf3n. De hecho, ya ha definido el esquema de tarea en el script ",(0,r.kt)("inlineCode",{parentName:"p"},"crear-todo")," anterior."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import {\n  ...\n  ValidateBody, ValidatePathParam\n} from '@foal/core';\n\nexport class ApiController {\n\n  ...\n\n  @Post('/todos')\n  @ValidateBody({\n    // Every additional properties that are not defined in the \"properties\"\n    // object should be removed.\n    additionalProperties: false,\n    properties: {\n      // The \"text\" property of ctx.request.body should be a string if it exists.\n      text: { type: 'string' }\n    },\n    // The property \"text\" is required.\n    required: [ 'text' ],\n    // The body request should be an object once parsed by the framework.\n    type: 'object',\n  })\n  async postTodo(ctx: Context) {\n    const todo = new Todo();\n    todo.text = ctx.request.body.text;\n\n    await todo.save();\n\n    return new HttpResponseCreated(todo);\n  }\n\n  @Delete('/todos/:id')\n  // The id should be a number. If it is not, the hook returns a \"400 - Bad Request\" error.\n  @ValidatePathParam('id', { type: 'number' })\n  async deleteTodo(ctx: Context) {\n    const todo = await Todo.findOne({ id: ctx.request.params.id });\n    if (!todo) {\n      return new HttpResponseNotFound();\n    }\n    await todo.remove();\n    return new HttpResponseNoContent();\n  }\n\n}\n\n")))}u.isMDXComponent=!0}}]);