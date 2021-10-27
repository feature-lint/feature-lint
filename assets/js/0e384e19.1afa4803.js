"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[671],{7522:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(9901);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},l=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),f=u(n),m=o,d=f["".concat(s,".").concat(m)]||f[m]||p[m]||i;return n?r.createElement(d,a(a({ref:t},l),{},{components:n})):r.createElement(d,a({ref:t},l))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var u=2;u<i;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},8562:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return l},default:function(){return f}});var r=n(5499),o=n(1805),i=(n(9901),n(7522)),a=["components"],c={sidebar_position:1,slug:"/"},s="Why Feature-lint",u={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Why Feature-lint",description:"When working in a team, the most important thing is to ensure everyone does things the same way.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/",permalink:"/feature-lint/",editUrl:"https://github.com/feature-lint/feature-lint/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/"},sidebar:"tutorialSidebar",next:{title:"Thought Model",permalink:"/feature-lint/concept-basics/concepts"}},l=[],p={toc:l};function f(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"why-feature-lint"},"Why Feature-lint"),(0,i.kt)("p",null,"When working in a team, the most important thing is ",(0,i.kt)("strong",{parentName:"p"},"to ensure everyone does things the same way"),".\nThis starts with formatting the code (e.g. using ",(0,i.kt)("a",{parentName:"p",href:"prettier.io"},"prettier"),") and ends that everyone\nnames the files according to the naming conventions."),(0,i.kt)("p",null,"But, from an architectural perspective, it may also be necessary, that ",(0,i.kt)("strong",{parentName:"p"},"imports")," are ensured and\nthe architectural principles don't get violated."),(0,i.kt)("p",null,"Although there exist code formatters like prettier and linters, like eslint, folder structure and\narchitectural aspects are often not recognized as first-class-citizen.\nThis is the gap feature-lint fills. Feature-lint's goal is to ensure, that folder structures,\nnaming conventions and architectural rules are adhered to - by everyone in the team. Automatically."))}f.isMDXComponent=!0}}]);