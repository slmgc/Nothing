!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(n.nothingMock={})}(this,function(n){"use strict";var t,e=((t=function(){return e}).toString=t.toLocaleString=t[Symbol.toPrimitive]=function(){return""},t.valueOf=function(){return!1},new Proxy(Object.freeze(t),{get:function(n,t){return n.hasOwnProperty(t)?n[t]:e}}));n.Nothing=e,n.toBool=function(n){return!(!n||!n.valueOf())},n.isNothing=function(n){return n===e},n.isSomething=function(n){return!(n===e||null==n)},n.serialize=function(n){return JSON.stringify(n,function(n,t){return t===e?null:t})},n.deserialize=function(n){return JSON.parse(n,function(n,t){return null===t?e:t})}});
//# sourceMappingURL=nothing-mock.umd.js.map