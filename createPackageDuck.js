import isPlainObject from "is-plain-object";
import { extendDuck } from "wrasse-duck-extend";

export default function(duck, { mountReducer, extensions } = {}) {
  if (!isPlainObject(duck)) throw new Error("Duck has to be a plain object");

  if (Array.isArray(extensions)) {
    extensions.forEach(extension => {
      const extensionObject =
        typeof extension === "function" ? extension(duck) : extension;

      duck = extendDuck(duck, extensionObject);
    });
  }

  if (typeof mountReducer === "function") {
    const { name, reducer } = duck;
    mountReducer(name, reducer);
  }

  return { ...duck };
}
