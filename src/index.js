export const Nothing = new function() {
	const fn = () => Nothing
	fn[Symbol.toPrimitive] = () => ''
	fn.valueOf = () => false

	return new Proxy(Object.freeze(fn), {
		get: (o, key) => o.hasOwnProperty(key) ? o[key] : Nothing
	})
}

export const toBool = (o) => !!(o && o.valueOf())
export const isNothing = (o) => o === Nothing
export const isSomething = (o) => !(o === Nothing || o == null)
export const serialize = (o) => JSON.stringify(o, (k, v) => v === Nothing ? null : v)
export const deserialize = (s) => JSON.parse(s, (k, v) => v === null ? Nothing : v)