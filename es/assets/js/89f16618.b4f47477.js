"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9834],{36085:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>c});var t=o(74848),s=o(28453);const r={title:"Version 2.1 release notes",author:"Lo\xefc Poullain",author_title:"Creator of FoalTS. Software engineer.",author_url:"https://loicpoullain.com",author_image_url:"https://avatars1.githubusercontent.com/u/13604533?v=4",tags:["release"]},i=void 0,a={permalink:"/es/blog/2021/02/03/version-2.1-release-notes",editUrl:"https://github.com/FoalTS/foal/edit/master/docs/blog/2021-02-03-version-2.1-release-notes.md",source:"@site/blog/2021-02-03-version-2.1-release-notes.md",title:"Version 2.1 release notes",description:"Banner",date:"2021-02-03T00:00:00.000Z",formattedDate:"3 de febrero de 2021",tags:[{label:"release",permalink:"/es/blog/tags/release"}],readingTime:1.495,hasTruncateMarker:!0,authors:[{name:"Lo\xefc Poullain",title:"Creator of FoalTS. Software engineer.",url:"https://loicpoullain.com",imageURL:"https://avatars1.githubusercontent.com/u/13604533?v=4"}],frontMatter:{title:"Version 2.1 release notes",author:"Lo\xefc Poullain",author_title:"Creator of FoalTS. Software engineer.",author_url:"https://loicpoullain.com",author_image_url:"https://avatars1.githubusercontent.com/u/13604533?v=4",tags:["release"]},unlisted:!1,prevItem:{title:"What's new in version 2 (part 1/4)",permalink:"/es/blog/2021/02/17/whats-new-in-version-2-part-1"}},l={authorsImageUrls:[void 0]},c=[{value:"New Error Page Design",id:"new-error-page-design",level:2},{value:"New Welcome Page",id:"new-welcome-page",level:2},{value:"CLI exits with code 1 when a command fails",id:"cli-exits-with-code-1-when-a-command-fails",level:2},{value:"New <code>@All</code> decorator",id:"new-all-decorator",level:2},{value:"New CSRF option in <code>@UseSessions</code> and <code>@JWT</code>",id:"new-csrf-option-in-usesessions-and-jwt",level:2},{value:"Support of <code>better-sqlite3</code>",id:"support-of-better-sqlite3",level:2}];function d(e){const n={code:"code",h2:"h2",img:"img",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Banner",src:o(61670).A+"",width:"914",height:"315"})}),"\n",(0,t.jsx)(n.p,{children:"Version 2.1 has been released! Here are the improvements that it brings."}),"\n",(0,t.jsx)(n.h2,{id:"new-error-page-design",children:"New Error Page Design"}),"\n",(0,t.jsx)(n.p,{children:"When an error is thrown or rejected in development, the server returns an error page with some debugging details. The UI of this page has been improved and it now provides more information."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Error page",src:o(74854).A+"",width:"1968",height:"832"})}),"\n",(0,t.jsx)(n.h2,{id:"new-welcome-page",children:"New Welcome Page"}),"\n",(0,t.jsx)(n.p,{children:"When creating a new project, the generated welcome page is also different."}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"Welcome page",src:o(81968).A+"",width:"1968",height:"830"})}),"\n",(0,t.jsx)(n.h2,{id:"cli-exits-with-code-1-when-a-command-fails",children:"CLI exits with code 1 when a command fails"}),"\n",(0,t.jsx)(n.p,{children:"This small improvement is useful when we want to stop a CI pipeline when one of its commands fails."}),"\n",(0,t.jsxs)(n.h2,{id:"new-all-decorator",children:["New ",(0,t.jsx)(n.code,{children:"@All"})," decorator"]}),"\n",(0,t.jsx)(n.p,{children:"This decorator handles all requests regardless of the HTTP verb (GET, POST, etc.)."}),"\n",(0,t.jsxs)(n.p,{children:["It can be used for example to create a ",(0,t.jsx)(n.code,{children:"not found"})," handler."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { All, HttpResponseNotFound } from '@foal/core';\n\nclass AppController {\n  subControllers = [ ViewController ];\n\n  @All('*')\n  notFound() {\n    return new HttpResponseNotFound('The route you are looking for does not exist.');\n  }\n}\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"new-csrf-option-in-usesessions-and-jwt",children:["New CSRF option in ",(0,t.jsx)(n.code,{children:"@UseSessions"})," and ",(0,t.jsx)(n.code,{children:"@JWT"})]}),"\n",(0,t.jsxs)(n.p,{children:["This option allows you to override the behavior of the configuration specified globally with the key ",(0,t.jsx)(n.code,{children:"settings.session.csrf.enabled"})," or the key ",(0,t.jsx)(n.code,{children:"settings.jwt.csrf.enabled"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"It can be useful for example to disable the CSRF protection on a specific route."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { HttpResponseOK, Post, UseSessions } from '@foal/core';\n\nexport class ApiController {\n  @Post('/foo')\n  @UseSessions({ cookie: true })\n  foo() {\n    // This method has the CSRF protection enabled.\n    return new HttpResponseOK();\n  }\n\n  @Post('/bar')\n  @UseSessions({ cookie: true, csrf: false })\n  bar() {\n    // This method does not have the CSRF protection enabled.\n    return new HttpResponseOK();\n  }\n}\n\n"})}),"\n",(0,t.jsxs)(n.h2,{id:"support-of-better-sqlite3",children:["Support of ",(0,t.jsx)(n.code,{children:"better-sqlite3"})]}),"\n",(0,t.jsxs)(n.p,{children:["When using Foal with SQLite, you now have the choice between two drivers: ",(0,t.jsx)(n.code,{children:"sqlite3"})," and ",(0,t.jsx)(n.code,{children:"better-sqlite3"}),". The package ",(0,t.jsx)(n.code,{children:"better-sqlite3"})," is used by default in new projects starting from this version on."]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},61670:(e,n,o)=>{o.d(n,{A:()=>t});const t=o.p+"assets/images/banner-64d50dc8df934fea97a407e6f47532de.png"},74854:(e,n,o)=>{o.d(n,{A:()=>t});const t=o.p+"assets/images/error-page-21d0ceed0c0839e2361e98f8c4145551.png"},81968:(e,n,o)=>{o.d(n,{A:()=>t});const t=o.p+"assets/images/welcome-page-e76abb3126e644b68ffddb46a38a8eb9.png"},28453:(e,n,o)=>{o.d(n,{R:()=>i,x:()=>a});var t=o(96540);const s={},r=t.createContext(s);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);