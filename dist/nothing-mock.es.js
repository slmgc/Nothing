var n,r=((n=function(){return r}).toString=n.toLocaleString=n[Symbol.toPrimitive]=function(){return""},n.valueOf=function(){return!1},new Proxy(Object.freeze(n),{get:function(n,t){return n.hasOwnProperty(t)?n[t]:r}})),t=function(n){return!(!n||!n.valueOf())},u=function(n){return n===r},e=function(n){return!(n===r||null==n)},o=function(n){return JSON.stringify(n,function(n,t){return t===r?null:t})},i=function(n){return JSON.parse(n,function(n,t){return null===t?r:t})};export{r as Nothing,t as toBool,u as isNothing,e as isSomething,o as serialize,i as deserialize};
//# sourceMappingURL=nothing-mock.es.js.map