"use strict";var n,t=((n=function(){return t}).toString=n.toLocaleString=n[Symbol.toPrimitive]=function(){return""},n.valueOf=function(){return!1},new Proxy(Object.freeze(n),{get:function(n,r){return n.hasOwnProperty(r)?n[r]:t}}));exports.Nothing=t,exports.toBool=function(n){return!(!n||!n.valueOf())},exports.isNothing=function(n){return n===t},exports.isSomething=function(n){return!(n===t||null==n)},exports.serialize=function(n){return JSON.stringify(n,function(n,r){return r===t?null:r})},exports.deserialize=function(n){return JSON.parse(n,function(n,r){return null===r?t:r})};
//# sourceMappingURL=nothing-mock.js.map