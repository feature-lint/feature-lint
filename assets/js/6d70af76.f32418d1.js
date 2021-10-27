"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[155],{7522:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return f}});var r=t(9901);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),u=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},s=function(e){var n=u(e.components);return r.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=u(t),f=a,m=d["".concat(c,".").concat(f)]||d[f]||p[f]||i;return t?r.createElement(m,o(o({ref:n},s),{},{components:t})):r.createElement(m,o({ref:n},s))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=d;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var u=2;u<i;u++)o[u]=t[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},7096:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return s},default:function(){return d}});var r=t(5499),a=t(1805),i=(t(9901),t(7522)),o=["components"],l={sidebar_position:5},c="Declaring Rules",u={unversionedId:"configuration/declaring-rules",id:"configuration/declaring-rules",isDocsHomePage:!1,title:"Declaring Rules",description:"This document is under construction",source:"@site/docs/configuration/declaring-rules.md",sourceDirName:"configuration",slug:"/configuration/declaring-rules",permalink:"/feature-lint/configuration/declaring-rules",editUrl:"https://github.com/feature-lint/feature-lint/docs/configuration/declaring-rules.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Declaring a Building Block",permalink:"/feature-lint/configuration/declaring-buildingblock"},next:{title:"Dependencies",permalink:"/feature-lint/configuration/rules/dependencies"}},s=[],p={toc:s};function d(e){var n=e.components,t=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"declaring-rules"},"Declaring Rules"),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"This document is under construction"))),(0,i.kt)("p",null,"After understanding, what ",(0,i.kt)("strong",{parentName:"p"},"features")," and ",(0,i.kt)("strong",{parentName:"p"},"building-blocks")," are, are vital part of feature-lint is to ensure\nrules, allowed relationships, between building blocks and features are adhered to."),(0,i.kt)("p",null,"To implement rules, you need to extend the configuration by adding a ",(0,i.kt)("strong",{parentName:"p"},"rules")," attribute on the\ncorresponding location."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"\n  "rootDir": "./src",\n  "rules": [], // you can have rules here\n  "featureTypes": {\n    "rules": [],  // or here\n    "angular": {\n      "rules": [], // or here\n      "featureNameMatcher": "angular-.*",\n      "services": {\n        "rules": [] // or here\n      },\n      "components": {\n      }\n    }\n  }\n}\n')),(0,i.kt)("p",null,"Of course, not all rules make sense in every context. That's why some rules are only available in specific scopes.\nThe application is dependent of the specific rule."),(0,i.kt)("p",null,"As of now the following rules are accessible."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"dependencies"),(0,i.kt)("li",{parentName:"ul"},"ensureName")))}d.isMDXComponent=!0}}]);