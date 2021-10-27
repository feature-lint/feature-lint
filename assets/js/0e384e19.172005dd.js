"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[671],{7522:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return m}});var n=r(9901);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),f=u(r),m=o,d=f["".concat(s,".").concat(m)]||f[m]||p[m]||i;return r?n.createElement(d,a(a({ref:t},l),{},{components:r})):n.createElement(d,a({ref:t},l))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var u=2;u<i;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},8562:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return l},default:function(){return f}});var n=r(5499),o=r(1805),i=(r(9901),r(7522)),a=["components"],c={sidebar_position:1,slug:"/"},s="Why Feature-lint",u={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Why Feature-lint",description:"When working in a team, the most important thing is to ensure everyone does things the same way.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/",permalink:"/feature-lint/",editUrl:"https://github.com/feature-lint/feature-lint/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/"},sidebar:"tutorialSidebar",next:{title:"Wording",permalink:"/feature-lint/wording"}},l=[],p={toc:l};function f(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"why-feature-lint"},"Why Feature-lint"),(0,i.kt)("p",null,"When working in a team, the most important thing is ",(0,i.kt)("strong",{parentName:"p"},"to ensure everyone does things the same way"),".\nThis starts with formatting the code (e.g. using ",(0,i.kt)("a",{parentName:"p",href:"prettier.io"},"prettier"),") and ends that everyone\nnames the files according to the naming conventions."),(0,i.kt)("p",null,"But, from an architectural perspective, it may also be necessary, that ",(0,i.kt)("strong",{parentName:"p"},"imports")," are ensured and\nthe architectural principles don't get violated."),(0,i.kt)("p",null,"Although there exist code formatters like prettier and linters, like eslint, folder structure and\narchitectural aspects are often not recognized as first-class-citizen.\nThis is the gap feature-lint fills. Feature-lint's goal is to ensure, that folder structures,\nnaming conventions and architectural rules are adhered to - by everyone in the team. Automatically."))}f.isMDXComponent=!0}}]);