# Nothing

[![npm package][npm-badge]][npm] [![npm package][npm-downloads]][npm]

**Nothing** is a chainable, callable mock object which always returns itself. You can use it instead of `null` and `undefined` values so you don't have to place safety checks all over your code. The implementation uses `Symbol` and `Proxy` behind the hood so your environment has to support it.

## How to install

```
npm i -S nothing-mock
```

## How to use
### Property accessors
```js
import {Nothing} from 'nothing-mock'

// A regular function with null-checks
function exampleFnWithNullChecks(obj) {
	return obj &&
		obj.namespace &&
		obj.namespace.actions &&
		obj.namespace.actions.someAction &&
		obj.namespace.actions.someAction()
}

// There is no need to check for null/undefined if you use Nothing
function exampleFn(obj) {
	return obj.namespace.actions.someAction()
}

exampleFnWithNullChecks(null) // returns null
exampleFn(Nothing) // returns Nothing
exampleFn(null) // throws an exception
```

### JSON serialization/deserialization
```js
import {Nothing, deserialize, serialize} from 'nothing-mock'

const json = `{
	"posts": [{
		"id": 1,
		"userId": 12,
		"content": "post 1",
		"comments": [{
			"id": 1,
			"userId": 34,
			"content": "comment 1"
		}, {
			"id": 2,
			"userId": 56,
			"content": "comment 2"
		}]
	}, {
		"id": 2,
		"userId": 78,
		"content": "post 2",
		"comments": null
	}]
}`

const {posts} = deserialize(json) /* returns: [{
	"id": 1,
	"userId": 12,
	"content": "post 1",
	"comments": [{
		"id": 1,
		"userId": 34,
		"content": "comment 1"
	}, {
		"id": 2,
		"userId": 56,
		"content": "comment 2"
	}]
}, {
	"id": 2,
	"userId": 78,
	"content": "post 2",
	"comments": Nothing // null values are replaced with Nothing
}] */

function renderPostWithComments(post) {
	return `<div>
		<p>${post.content}</p>
		<ul>${post.comments.map((comment) =>
			`<li>${comment.content}</li>`).join('')
		}</ul>
	</div>`
}

posts.map(renderPostWithComments).join('') /* returns:
`<div>
	<p>post 1</p>
	<ul>
		<li>comment 1</li>
		<li>comment 2</li>
	</ul>
</div>
<div>
	<p>post 2</p>
	<ul></ul> // Nothing is rendered empty
</div>` */

// Changes all Nothing values to null
serialize({posts})
```

### Filtering and helpers
```js
import {Nothing, toBool, isNothing, isSomething} from 'nothing-mock'

const list = [Nothing, true, false, null, undefined, 0, 1, NaN, '', {}, []]
list.filter(Boolean) // [Nothing, true, 1, {}, []]
list.filter(isNaN) // [undefined, NaN, {}]
list.filter(isNothing) // [Nothing]
list.filter(isSomething) // [true, false, 0, 1, NaN, "", {}, []]
list.filter(Number) // [true, 1]
list.filter(String) // [true, false, null, undefined, 0, 1, NaN, {}]
list.filter(toBool) // [true, 1, {}, []]
```

### A list of properties which don't return Nothing
```jsx
import {Nothing} from 'nothing-mock'

Nothing.length // 0
Nothing.name // a string
Nothing.prototype // an object with a constructor
Nothing.toLocaleString() // ""
Nothing.toString() // ""
Nothing.valueOf() // false
```

### Typecasting and gotchas
```js
import {Nothing, toBool} from 'nothing-mock'

String(Nothing) // ""
Nothing.toString() // ""
Nothing + 'a string' // "a string"
Nothing * 123 // 0
Nothing - 123 // -123

// Gotcha: concatenation of Nothing and a number returns a string
Nothing + 123 // "123"

// Solution: Nothing can be excplicitly converted to a number
Number(Nothing) // 0
Number(Nothing) + 123 // 123

// Gotcha: typecasting of Nothing to a boolean returns true
Boolean(Nothing) // true
!!Nothing // true

// Solution: Nothing can be properly converted to a falsy value
Nothing.valueOf() // false
toBool(Nothing) // false
toBool(undefined) // false
toBool(123) // true

// Gotcha: returning Nothing from a promise never resolves
// as Nothing is a thenable object
somePromise
	.then(() => Nothing)
	.then((result) => result) // pending indefinitely

// Solution: wrapping Nothing in an object resolves the issue
somePromise
	.then(() => ({result: Nothing}))
	.then((result) => result) // promise resolves
```

## FAQ

Q: Proxies are slow and there is a runtime overhead. Why should I use **Nothing**?
A: You should keep a few things in mind:

1. "Premature optimization is the root of all evil" - Donald E. Knuth.
1. Native implementation of Proxies will eventually get better in modern browsers.
1. Have you checked the performance of **Nothing**? Does it really impact the performance of your code that much? Is there a better algorithm to use? If it does affect the performance, you can always opt out using **Nothing** for performance-critical parts of your code.
1. You can use **Nothing** for writing unit tests which are less likely to be performance-dependant.

Q: I believe that it's hard to understand the logic as the code will fail silently if I would use **Nothing**. I prefer to use try/catch blocks instead, e.g.:

```js
try {
	a.b.c()
} catch (e) {
	// deal with it somehow
}
```

A: As for the failing silently statement, you can always check the result in cases where a function call should never return **Nothing** and then handle it properly:

```js
const someFunction = (param) => {
	const result = a.b.c(param)
	return isNothing(result) ? handleNothing(param) : result
}
```

Many functional programming languages either don't have or don't endorse the use of imperative constructs such as try/catch blocks because they introduce so-called side effects which actually make it hard to debug and reason about the code. And programs which are written in functional programming languages are considered to be less error-prone and easier to support.

Q: I have to support older browsers, is there a `Proxy` polyfill?
A: Sadly, there isn't one which supports **Nothing**-related case. But you can use **Nothing** with unit tests as Node supports Proxies.

Q: Why should I use **Nothing** if there are better alternatives like [optional chaining] or [lodash.get]?
A: Each of these solutions have their pros and cons. Your choice should depend on the use-case:

1. Optional chaining syntax would be the best choice, but it requires a transpilation step as modern browsers don't support the syntax and it might take a while before it will get into the future ECMAScript standard.
1. `lodash.get` is good for basic property chain traversal, but it requires an alien syntax and fails when there is a need to call a method somewhere in the property chain:

```js
import get from 'lodash.get'

var a = null
get(a, ['b', 'c'])() // this will throw an exception

var c = get(a, ['b', 'c'])
c && c() // this won't work if `c` should be bound to the context of `b`

// For example:
var a = {
	b: {
		d: 'hello',
		c() {
			console.log(this.d)
		}
	}
}

a.b.c() // outputs "hello"
get(a, ['b', 'c'])() // outputs "undefined"

// This would be a proper solution:
var b = get(o, ['b'])
var c = get(b, ['c'])
c && c.call(b)

// But then it's easier to get back to the regular syntax:
a && a.b && a.b.c && a.b.c()

// And good luck using `get` for something like this:
a.b.c()[0].map(() => { /* do something */ })

// BTW, an implementation of a lodash-like `get` helper-function is basically a one-liner:
const get = (o, a) => a.reduce((p, c) => p && p[c], o)
```

Q: I am still not convinced and ain't gonna use **Nothing**!
A: Thanks for letting me know! Seriously, it's your choice, I am down with it.

## License
MIT

[npm]: https://www.npmjs.org/package/nothing-mock
[npm-badge]: https://img.shields.io/npm/v/nothing-mock.svg
[npm-downloads]: https://img.shields.io/npm/dm/nothing-mock.svg
[optional chaining]: https://www.npmjs.com/package/babel-plugin-transform-optional-chaining
[lodash.get]: https://www.npmjs.com/package/lodash.get