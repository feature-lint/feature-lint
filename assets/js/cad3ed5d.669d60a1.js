"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[537],{7522:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return d}});var r=t(9901);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},s=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),f=c(t),d=o,b=f["".concat(l,".").concat(d)]||f[d]||p[d]||i;return t?r.createElement(b,a(a({ref:n},s),{},{components:t})):r.createElement(b,a({ref:n},s))}));function d(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=f;var u={};for(var l in n)hasOwnProperty.call(n,l)&&(u[l]=n[l]);u.originalType=e,u.mdxType="string"==typeof e?e:o,a[1]=u;for(var c=2;c<i;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},1914:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return s},default:function(){return f}});var r=t(5499),o=t(1805),i=(t(9901),t(7522)),a=["components"],u={sidebar_position:4},l="No unknown Building blocks",c={unversionedId:"configuration/rules/no-unknown-bb",id:"configuration/rules/no-unknown-bb",isDocsHomePage:!1,title:"No unknown Building blocks",description:'The "no-unknown-building-blocks" ensures, that building blocks are known.',source:"@site/docs/configuration/rules/no-unknown-bb.md",sourceDirName:"configuration/rules",slug:"/configuration/rules/no-unknown-bb",permalink:"/feature-lint/configuration/rules/no-unknown-bb",editUrl:"https://github.com/feature-lint/feature-lint/docs/configuration/rules/no-unknown-bb.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"No  missing feature-types",permalink:"/feature-lint/configuration/rules/no-unknown-ft"}},s=[{value:"Reasoning",id:"reasoning",children:[]},{value:"Implementation",id:"implementation",children:[{value:"Example",id:"example",children:[]}]}],p={toc:s};function f(e){var n=e.components,t=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"no-unknown-building-blocks"},"No unknown Building blocks"),(0,i.kt)("p",null,'The "no-unknown-building-blocks" ensures, that building blocks are known.'),(0,i.kt)("h2",{id:"reasoning"},"Reasoning"),(0,i.kt)("p",null,'There are usecases, where you want to ensure, that no "dead" folders exist, which are not\nmanaged by feature-lint. Therefore a rule ',(0,i.kt)("inlineCode",{parentName:"p"},"no-unknown-buildingblocks")," exists.\nThis rule makes feature-lint fail, if it encounters folders, which it does not know about."),(0,i.kt)("h2",{id:"implementation"},"Implementation"),(0,i.kt)("p",null,"This rule is applicable to the root of the project."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"\n  "rootDir": "./src",\n    "rules": [\n      {\n        "name": "no-unknown-building-blocks",\n        "enabled": true\n      }\n    ]\n}\n')),(0,i.kt)("p",null,"This rule is ",(0,i.kt)("strong",{parentName:"p"},"enabled=true")," by default."),(0,i.kt)("h3",{id:"example"},"Example"),(0,i.kt)("p",null,"Given the following config:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"\n  "rootDir": "./src",\n  "featureTypes": {\n    "react": {\n      "featureNameMatcher": "react-.*",\n       "buildingBlocks": {\n         "components": {}\n       }\n    }\n  }\n}\n')),(0,i.kt)("p",null,"And the following tree:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"src/\n   react-dialog/ // known feature-type: react\n     components/ // known bb\n     hooks/ // unknown bb: not specified in the configuration\n")),(0,i.kt)("p",null,"Feature-lint would fail, if it encounters ",(0,i.kt)("inlineCode",{parentName:"p"},"hooks/"),"."))}f.isMDXComponent=!0}}]);