import isPlainObject from 'is-plain-object'
import { extendDuck } from 'wrasse-duck-extend'

export default function(duck, { mountReducer, extensions } = {}) {
  if (!isPlainObject(duck)) throw new Error('Duck has to be a plain object')

  let extendedDuck = duck

  if (Array.isArray(extensions)) {
    extensions.forEach(extension => {
      const extensionObject =
        typeof extension === 'function' ? extension(extendedDuck) : extension

      extendedDuck = extendDuck(extendedDuck, extensionObject)
    })
  }

  if (typeof mountReducer === 'function') {
    const { name, reducer } = extendedDuck
    mountReducer(name, reducer)
  }

  return { ...extendedDuck }
}
