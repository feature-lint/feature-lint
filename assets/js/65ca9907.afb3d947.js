"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[113],{7522:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var r=t(9901);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),f=l(t),m=o,d=f["".concat(s,".").concat(m)]||f[m]||p[m]||a;return t?r.createElement(d,i(i({ref:n},c),{},{components:t})):r.createElement(d,i({ref:n},c))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=f;var u={};for(var s in n)hasOwnProperty.call(n,s)&&(u[s]=n[s]);u.originalType=e,u.mdxType="string"==typeof e?e:o,i[1]=u;for(var l=2;l<a;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},1514:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return c},default:function(){return f}});var r=t(5499),o=t(1805),a=(t(9901),t(7522)),i=["components"],u={sidebar_position:3},s="No  missing feature-types",l={unversionedId:"configuration/rules/no-unknown-ft",id:"configuration/rules/no-unknown-ft",isDocsHomePage:!1,title:"No  missing feature-types",description:'The "no-missing-feature-types" ensures, that feature-types are known.',source:"@site/docs/configuration/rules/no-unknown-ft.md",sourceDirName:"configuration/rules",slug:"/configuration/rules/no-unknown-ft",permalink:"/feature-lint/configuration/rules/no-unknown-ft",editUrl:"https://github.com/feature-lint/feature-lint/docs/configuration/rules/no-unknown-ft.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Ensure Name",permalink:"/feature-lint/configuration/rules/ensureName"},next:{title:"No unknown Building blocks",permalink:"/feature-lint/configuration/rules/no-unknown-bb"}},c=[{value:"Reasoning",id:"reasoning",children:[]},{value:"Implementation",id:"implementation",children:[{value:"Example",id:"example",children:[]}]}],p={toc:c};function f(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"no--missing-feature-types"},"No  missing feature-types"),(0,a.kt)("p",null,'The "no-missing-feature-types" ensures, that feature-types are known.'),(0,a.kt)("h2",{id:"reasoning"},"Reasoning"),(0,a.kt)("p",null,'There are usecases, where you want to ensure, that no "dead" folders exist, which are not\nmanaged by feature-lint. Therefore a rule `no-missing-feature-types exists.\nThis rule makes feature-lint fail, if it encounters feature-type folders, which it does not know about.'),(0,a.kt)("h2",{id:"implementation"},"Implementation"),(0,a.kt)("p",null,"This rule is applicable to the root of the project."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"\n  "rootDir": "./src",\n    "rules": [\n      {\n        "name": "no-missing-feature-types",\n        "enabled": true\n      }\n    ]\n}\n')),(0,a.kt)("p",null,"This rule is ",(0,a.kt)("strong",{parentName:"p"},"enabled=true")," by default."),(0,a.kt)("h3",{id:"example"},"Example"),(0,a.kt)("p",null,"Given the following config:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"\n  "rootDir": "./src",\n  "featureTypes": {\n    "react": {\n      "featureNameMatcher": "react-.*"\n       // ...\n    }\n  }\n}\n')),(0,a.kt)("p",null,"And the following tree:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"src/\n   this-is-not-known/ // feature-type not defined\n   react-dialog/ // known feature-type: react\n")),(0,a.kt)("p",null,"Feature-lint would fail, if it encounters ",(0,a.kt)("inlineCode",{parentName:"p"},"this-is-not-known"),"."))}f.isMDXComponent=!0}}]);