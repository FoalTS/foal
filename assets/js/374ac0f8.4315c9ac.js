"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6871],{68568:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>l,frontMatter:()=>r,metadata:()=>c,toc:()=>a});var o=t(74848),s=t(28453);const r={title:"JWT hooks and CSRF protection"},i=void 0,c={id:"upgrade-to-v2/jwt-and-csrf",title:"JWT hooks and CSRF protection",description:"Configuration",source:"@site/versioned_docs/version-2.x/upgrade-to-v2/jwt-and-csrf.md",sourceDirName:"upgrade-to-v2",slug:"/upgrade-to-v2/jwt-and-csrf",permalink:"/docs/2.x/upgrade-to-v2/jwt-and-csrf",draft:!1,unlisted:!1,editUrl:"https://github.com/FoalTS/foal/edit/master/docs/versioned_docs/version-2.x/upgrade-to-v2/jwt-and-csrf.md",tags:[],version:"2.x",frontMatter:{title:"JWT hooks and CSRF protection"}},d={},a=[{value:"Configuration",id:"configuration",level:2},{value:"CSRF protection",id:"csrf-protection",level:2},{value:"New features",id:"new-features",level:2},{value:"JWT cookies",id:"jwt-cookies",level:3},{value:"Read secrets and private/public keys",id:"read-secrets-and-privatepublic-keys",level:3}];function h(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,o.jsxs)(n.p,{children:["The configuration ",(0,o.jsx)(n.code,{children:"settings.jwt.secretOrPublicKey"})," has been removed. Use ",(0,o.jsx)(n.code,{children:"settings.jwt.secret"})," or ",(0,o.jsx)(n.code,{children:"settings.jwt.publicKey"})," instead."]}),"\n",(0,o.jsxs)(n.p,{children:["The configuration ",(0,o.jsx)(n.code,{children:"settings.jwt.cookieName"})," has been renamed to ",(0,o.jsx)(n.code,{children:"settings.jwt.cookie.name"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["See also ",(0,o.jsx)(n.a,{href:"/docs/2.x/upgrade-to-v2/config-system#environment-variables",children:"this"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"csrf-protection",children:"CSRF protection"}),"\n",(0,o.jsxs)(n.p,{children:["The package ",(0,o.jsx)(n.code,{children:"@foal/csrf"})," has been removed. In version 2, the CSRF protection is directly included in the JWT hooks and can be enabled with ",(0,o.jsx)(n.code,{children:"settings.jwt.csrf.enabled"})," (the configuration key ",(0,o.jsx)(n.code,{children:"settings.csrf.enabled"})," has been removed)."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{children:"npm uninstall @foal/csrf\n"})}),"\n",(0,o.jsx)(n.p,{children:"There is no need anymore to provide a CSRF secret."}),"\n",(0,o.jsxs)(n.p,{children:["There is no need anymore to set manually the value of the ",(0,o.jsx)(n.code,{children:"sameSite"})," cookie attribute in the config."]}),"\n",(0,o.jsx)(n.p,{children:"There is no need anymore to specify an expire time for the CSRF cookie."}),"\n",(0,o.jsx)(n.p,{children:"All of this is now managed by the framework."}),"\n",(0,o.jsxs)(n.p,{children:["The best way to use the new CSRF protection is to go directly to the ",(0,o.jsx)(n.a,{href:"/docs/2.x/security/csrf-protection",children:"CSRF page"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Warning:"})," Using the below functions ",(0,o.jsx)(n.code,{children:"setAuthCookie"})," and ",(0,o.jsx)(n.code,{children:"removeAuthCookie"})," is required in order to provide CSRF protection."]}),"\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Warning:"})," In order to ",(0,o.jsx)(n.em,{children:"work better"})," with some popular frontend frameworks, the default name of the CSRF cookie has been changed from ",(0,o.jsx)(n.code,{children:"csrfToken"})," to ",(0,o.jsx)(n.code,{children:"XSRF-TOKEN"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"new-features",children:"New features"}),"\n",(0,o.jsxs)(n.p,{children:["New features have been added to reduce the amount of code needed to use JWT as well as to make it easier to use. You can consult the ",(0,o.jsx)(n.a,{href:"/docs/2.x/authentication-and-access-control/quick-start",children:"Quick start page"})," to see how to use these features."]}),"\n",(0,o.jsx)(n.h3,{id:"jwt-cookies",children:"JWT cookies"}),"\n",(0,o.jsxs)(n.p,{children:["The JWT package has two new functions ",(0,o.jsx)(n.code,{children:"setAuthCookie"})," and ",(0,o.jsx)(n.code,{children:"removeAuthCookie"})," to manage JWT with cookies."]}),"\n",(0,o.jsx)(n.h3,{id:"read-secrets-and-privatepublic-keys",children:"Read secrets and private/public keys"}),"\n",(0,o.jsxs)(n.p,{children:["Secrets and private/public keys can be read from the configuration with the two new functions ",(0,o.jsx)(n.code,{children:"getSecretOrPrivateKey"})," and ",(0,o.jsx)(n.code,{children:"getSecretOrPublicKey"}),"."]}),"\n",(0,o.jsxs)(n.p,{children:["Encoded secrets with the configuration key ",(0,o.jsx)(n.code,{children:"settings.jwt.secretEncoding"})," are supported."]})]})}function l(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>c});var o=t(96540);const s={},r=o.createContext(s);function i(e){const n=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),o.createElement(r.Provider,{value:n},e.children)}}}]);