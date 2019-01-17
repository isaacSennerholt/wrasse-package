import createPackageDuck from "./createPackageDuck.js";

export default function({ duck, serviceComponent, options = {} }) {
  if (typeof serviceComponent !== "function") {
    throw new Error("Service component has to be a function");
  }

  const { mountReducer, extensions, components, componentLibrary } = options;
  const { name: serviceComponentName } = serviceComponent;

  if (!serviceComponentName) {
    throw new Error("Service component has to be a named function");
  }

  const packageDuck = createPackageDuck(duck, {
    mountReducer,
    extensions
  });

  const ServiceComponent = serviceComponent(packageDuck);
  let packageComponents = {};

  if (Array.isArray(components)) {
    packageComponents = components.reduce((packageComponents, component) => {
      const { name: componentName } = component;
      if (componentName && typeof component === "function") {
        packageComponents[componentName] = component(
          ServiceComponent,
          componentLibrary
        );
      }
      return packageComponents;
    }, {});
  }

  return {
    ...packageDuck,
    ...packageComponents,
    [serviceComponentName]: ServiceComponent
  };
}
