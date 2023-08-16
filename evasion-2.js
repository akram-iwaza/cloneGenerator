(function () {
  const patchPlugins = (ctxWindow) => {
    const parsedData = {
      mimeTypes: [
        {
          type: "application/pdf",
          suffixes: "pdf",
          description: "Portable Document Format",
          __pluginName: "",
        },
        {
          type: "text/pdf",
          suffixes: "pdf",
          description: "Portable Document Format",
          __pluginName: "",
        },
      ],
      plugins: [
        {
          name: "PDF Viewer",
          filename: "internal-pdf-viewer",
          description: "Portable Document Format",
          __mimeTypes: ["application/pdf", "text/pdf"],
        },
        {
          name: "Chrome PDF Viewer",
          filename: "internal-pdf-viewer",
          description: "Portable Document Format",
          __mimeTypes: ["application/pdf", "text/pdf"],
        },
        {
          name: "Chromium PDF Viewer",
          filename: "internal-pdf-viewer",
          description: "Portable Document Format",
          __mimeTypes: ["application/pdf", "text/pdf"],
        },
        {
          name: "Microsoft Edge PDF Viewer",
          filename: "internal-pdf-viewer",
          description: "Portable Document Format",
          __mimeTypes: ["application/pdf", "text/pdf"],
        },
        {
          name: "WebKit built-in PDF",
          filename: "internal-pdf-viewer",
          description: "Portable Document Format",
          __mimeTypes: ["application/pdf", "text/pdf"],
        },
      ],
    };

    const generateFunctionMocks = (proto, itemMainProp, dataArray) => ({
      /** Returns the MimeType object with the specified index. */
      item: new ctxWindow.Proxy(proto.item, {
        apply(target, ctx, args) {
          if (!args.length) {
            throw new ctxWindow.TypeError(
              `Failed to execute 'item' on '${
                proto[ctxWindow.Symbol.toStringTag]
              }': 1 argument required, but only 0 present.`
            );
          }
          // Special behavior alert:
          // - Vanilla tries to cast strings to Numbers (only integers!) and use them as property index lookup
          // - If anything else than an integer (including as string) is provided it will return the first entry
          const isInteger =
            args[0] && ctxWindow.Number.isInteger(ctxWindow.Number(args[0])); // Cast potential string to number first, then check for integer

          return (
            (isInteger ? dataArray[ctxWindow.Number(args[0])] : dataArray[0]) ||
            null
          );
        },
      }),
      /** Returns the MimeType object with the specified name. */
      namedItem: new ctxWindow.Proxy(proto.namedItem, {
        apply(target, ctx, args) {
          if (!args.length) {
            throw new ctxWindow.TypeError(
              `Failed to execute 'namedItem' on '${
                proto[ctxWindow.Symbol.toStringTag]
              }': 1 argument required, but only 0 present.`
            );
          }
          return dataArray.find((mt) => mt[itemMainProp] === args[0]) || null;
        },
      }),
      /** Does nothing and shall return nothing */
      refresh: proto.refresh
        ? new ctxWindow.Proxy(proto.refresh, {
            apply(target, ctx, args) {
              return undefined;
            },
          })
        : undefined,
    });

    const generateMagicArray = (dataArray, proto, itemProto, itemMainProp) => {
      // Quick helper to set props with the same descriptors vanilla is using
      const defineProp = (obj, prop, value) =>
        ctxWindow.Object.defineProperty(obj, prop, {
          value,
          writable: false,
          enumerable: false,
          configurable: true,
        });

      // Loop over our fake data and construct items
      const makeItem = (data) => {
        const item = {};
        for (const prop of ctxWindow.Object.keys(data)) {
          if (prop.startsWith("__")) {
            continue;
          }
          defineProp(item, prop, data[prop]);
        }
        return patchItem(item, data);
      };

      const patchItem = (item, data) => {
        let descriptor = ctxWindow.Object.getOwnPropertyDescriptors(item);

        if (itemProto === ctxWindow.Plugin.prototype) {
          descriptor = {
            ...descriptor,
            length: {
              value: data.__mimeTypes.length,
              writable: false,
              enumerable: false,
              configurable: true,
            },
          };
        }

        const obj = ctxWindow.Object.create(itemProto, descriptor);

        // Virtually all property keys are not enumerable in vanilla
        const blacklist = [
          ...ctxWindow.Object.keys(data),
          "length",
          "enabledPlugin",
        ];

        return new ctxWindow.Proxy(obj, {
          ownKeys(target) {
            return ctxWindow.Reflect.ownKeys(target).filter(
              (k) => !blacklist.includes(k)
            );
          },
          getOwnPropertyDescriptor(target, prop) {
            if (blacklist.includes(prop)) {
              return undefined;
            }

            return ctxWindow.Reflect.getOwnPropertyDescriptor(target, prop);
          },
        });
      };

      const magicArray = [];

      // Loop through our fake data and use that to create convincing entities
      dataArray.forEach((data) => {
        magicArray.push(makeItem(data));
      });

      magicArray.forEach((entry) => {
        defineProp(magicArray, entry[itemMainProp], entry);
      });

      const magicArrayObj = ctxWindow.Object.create(proto, {
        ...ctxWindow.Object.getOwnPropertyDescriptors(magicArray),

        length: {
          value: magicArray.length,
          writable: false,
          enumerable: false,
          configurable: true,
        },
      });

      // Generate our functional function mocks :-)
      const functionMocks = generateFunctionMocks(
        proto,
        itemMainProp,
        magicArray
      );

      // We need to overlay our custom object with a JS Proxy
      const magicArrayObjProxy = new ctxWindow.Proxy(magicArrayObj, {
        get(target, key = "") {
          // Redirect function calls to our custom proxied versions mocking the vanilla behavior
          if (key === "item") {
            return functionMocks.item;
          }
          if (key === "namedItem") {
            return functionMocks.namedItem;
          }
          if (proto === ctxWindow.PluginArray.prototype && key === "refresh") {
            return functionMocks.refresh;
          }
          // Everything else can pass through as normal
          return ctxWindow.Reflect.get(...arguments);
        },
        ownKeys(target) {
          const keys = [];
          const typeProps = magicArray.map((mt) => mt[itemMainProp]);
          typeProps.forEach((_, i) => keys.push(`${i}`));
          typeProps.forEach((propName) => keys.push(propName));
          return keys;
        },
        getOwnPropertyDescriptor(target, prop) {
          if (prop === "length") {
            return undefined;
          }

          return ctxWindow.Reflect.getOwnPropertyDescriptor(target, prop);
        },
      });

      return magicArrayObjProxy;
    };

    const generateMimeTypeArray = (mimeTypesData) =>
      generateMagicArray(
        mimeTypesData,
        ctxWindow.MimeTypeArray.prototype,
        ctxWindow.MimeType.prototype,
        "type"
      );
    const generatePluginsArray = (pluginsData) =>
      generateMagicArray(
        pluginsData,
        ctxWindow.PluginArray.prototype,
        ctxWindow.Plugin.prototype,
        "name"
      );

    const mimeTypes = generateMimeTypeArray(parsedData.mimeTypes);
    const plugins = generatePluginsArray(parsedData.plugins);

    for (const pluginData of parsedData.plugins) {
      pluginData.__mimeTypes.forEach((type, index) => {
        plugins[pluginData.name][index] = mimeTypes[type];

        ctxWindow.Object.defineProperty(plugins[pluginData.name], type, {
          value: mimeTypes[type],
          writable: false,
          enumerable: false, // Not enumerable
          configurable: true,
        });

        ctxWindow.Object.defineProperty(mimeTypes[type], "enabledPlugin", {
          value:
            type === "application/x-pnacl"
              ? mimeTypes["application/x-nacl"].enabledPlugin // these reference the same plugin, so we need to re-use the Proxy in order to avoid leaks
              : new Proxy(plugins[pluginData.name], {}), // Prevent circular references
          writable: false,
          enumerable: false,
          configurable: true,
        });
      });
    }

    const replaceProperty = (obj, propName, descriptorOverrides = {}) => {
      return ctxWindow.Object.defineProperty(obj, propName, {
        // Copy over the existing descriptors (writable, enumerable, configurable, etc)
        ...(ctxWindow.Object.getOwnPropertyDescriptor(obj, propName) || {}),
        // Add our overrides (e.g. value, get())
        ...descriptorOverrides,
      });
    };

    const patchNavigator = (name, value) => {
      replaceProperty(
        ctxWindow.Object.getPrototypeOf(ctxWindow.navigator),
        name,
        {
          get() {
            return value;
          },
        }
      );
    };

    patchNavigator("mimeTypes", mimeTypes);
    patchNavigator("plugins", plugins);
  };

  const possibleRttValues = [50, 100];

  const rtt =
    possibleRttValues[Math.floor(Math.random() * possibleRttValues.length)];

  const patchWindow = (ctx) => {
    patchPlugins(ctx);

    const navProto = ctx.Object.getPrototypeOf(ctx.navigator);

    if ("connection" in ctx.navigator) {
      ctx.Object.defineProperty(ctx.navigator.connection, "rtt", {
        get() {
          return rtt;
        },
      });
    }

    ctx.chrome = {
      runtime: {},
    };

    ctx.Object.defineProperty(navProto, "pdfViewerEnabled", {
      get() {
        return true;
      },
    });

    ctx.Object.defineProperty(navProto, "languages", {
      get: function () {
        return ["en-US", "en"];
      },
    });

    ctx.Object.defineProperty(navProto, "webdriver", {
      get: function () {
        return false;
      },
      configurable: false,
    });

    ctx.Object.defineProperty(ctx, "screenX", {
      get() {
        return 10;
      },
    });

    ctx.Object.defineProperty(ctx, "screenY", {
      get() {
        return 10;
      },
    });

    ctx.Object.defineProperty(ctx.Screen.prototype, "availWidth", {
      get() {
        return 1920;
      },
    });

    ctx.Object.defineProperty(ctx.Screen.prototype, "availHeight", {
      get() {
        return 1040;
      },
    });

    ctx.Object.defineProperty(ctx, "outerWidth", {
      get() {
        return "replaceWidth";
      },
    });

    ctx.Object.defineProperty(ctx, "outerHeight", {
      get() {
        return "replaceHeigh";
      },
    });
  };

  Object.defineProperty(window, "innerWidth", {
    get() {
      return 0;
    },
  });

  Object.defineProperty(window, "innerHeight", {
    get() {
      return 0;
    },
  });

  window.Object.defineProperty(HTMLBodyElement.prototype, "clientWidth", {
    get() {
      return 0;
    },
  });

  window.Object.defineProperty(HTMLBodyElement.prototype, "clientHeight", {
    get() {
      return 18;
    },
  });

  patchWindow(window);

  HTMLBodyElement.prototype.appendChild = new Proxy(
    HTMLBodyElement.prototype.appendChild,
    {
      apply(target, thisArg, argumentsList) {
        const result = Reflect.apply(target, thisArg, argumentsList);

        if (argumentsList[0] instanceof HTMLIFrameElement) {
          patchWindow(result.contentWindow);
        }

        return result;
      },
    }
  );
})();
