import createPackageDuck from "./createPackageDuck.js";

export default function({ duck, service = {}, options = {} }) {
  const serviceEntry = Object.entries(service)[0]
  const serviceName = serviceEntry[0]
  const serviceComponent = serviceEntry[1]
  const { mountReducer, extensions, components, componentLibrary } = options;

  if (typeof serviceName !== 'string') {
    throw new Error("Service name has to be a string.");
  }
  
  if (typeof serviceComponent !== "function") {
    throw new Error("Service component has to be a function.");
  }

  const packageDuck = createPackageDuck(duck, {
    mountReducer,
    extensions
  });

  const ServiceComponent = serviceComponent(packageDuck);
  let packageComponents = {};

  if (Array.isArray(components)) {
    packageComponents = components.reduce((packageComponents, componentObject) => {
      const componentEntry = Object.entries(componentObject)[0]
      const componentName = componentEntry[0]
      const component = componentEntry[1]
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
    [serviceName]: ServiceComponent
  };
}
