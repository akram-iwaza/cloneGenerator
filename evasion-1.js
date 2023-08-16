(function () {
  const stackOverride = (ctx) => {
    ctx.Object.defineProperty = new Proxy(ctx.Object.defineProperty, {
      apply(target, thisArg, argumentsList) {
        if (argumentsList[0] && argumentsList[1] === "stack") {
          return;
        }

        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  };

  stackOverride(window);

  HTMLBodyElement.prototype.appendChild = new Proxy(
    HTMLBodyElement.prototype.appendChild,
    {
      apply(target, thisArg, argumentsList) {
        const result = Reflect.apply(target, thisArg, argumentsList);

        if (
          argumentsList[0] instanceof HTMLIFrameElement &&
          argumentsList[0].contentWindow
        ) {
          stackOverride(argumentsList[0].contentWindow);
        }

        return result;
      },
    }
  );

  Object.keys = new Proxy(Object.keys, {
    apply: function (target, thisArg, argumentsList) {
      const result = Reflect.apply(target, thisArg, argumentsList);

      if (argumentsList[0] === window) {
        return result.filter(
          (key) => !["waitError", "sendStatus"].includes(key)
        );
      }

      return result;
    },
  });

  if (
    window.screen.height === 1080 &&
    window.screen.width === 1920 &&
    window.screen.availWidth === 1920 &&
    window.screen.availHeight === 1080
  ) {
    Object.defineProperty(window.screen, "availHeight", { value: 1040 });
  }
})();
