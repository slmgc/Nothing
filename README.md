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

function executeActionWithNullChecks(context) {
	return context &&
		context.namespace &&
		context.namespace.actions &&
		context.namespace.actions.someAction &&
		context.namespace.actions.someAction()
}

// no need to check for null/undefined
function executeAction(context) {
	return context.namespace.actions.someAction()
}

executeActionWithNullChecks(null) // returns null
executeAction(Nothing) // returns Nothing
executeAction(null) // throws an exception
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

serialize({posts}) // changes all Nothing values to null
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

// Gotcha: returning Nothing from a promise never resolves as Nothing is
// a thenable object
somePromise
	.then(() => Nothing)
	.then((result) => result) // pending indefinitely

// Solution: wrapping of Nothing into an object resolves successfully
somePromise
	.then(() => ({result: Nothing}))
	.then((result) => result) // promise resolves
```

## License
MIT

[npm]: https://www.npmjs.org/package/nothing-mock
[npm-badge]: https://img.shields.io/npm/v/nothing-mock.svg
[npm-downloads]: https://img.shields.io/npm/dm/nothing-mock.svg
