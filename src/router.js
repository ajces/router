export function updateMeta(meta) {
  document.title = meta.title;
  const dynamicMeta = [].filter.call(
    document.getElementsByTagName("meta"),
    function(el) {
      if (
        el.name === "" ||
        el.name === "origin" ||
        el.name === "referrer" ||
        el.name === "viewport"
      ) {
        return false;
      } else {
        return true;
      }
    }
  );
  const keys = Object.keys(meta).filter(function(k) {
    k !== "title";
  });
  const handled = [];
  keys.forEach(function(k) {
    const metaEl = dynamicMeta.filter(function(el) {
      el.name === k;
    })[0];
    if (metaEl === undefined) {
      // add missing meta element to head
      const newMeta = document.createElement("meta");
      newMeta.setAttribute("name", k);
      newMeta.setAttribute("content", meta[k]);
      document.head.appendChild(newMeta);
    } else {
      // update existing meta element
      metaEl.setAttribute("content", meta[k]);
    }
    handled.push(k);
  });
  keys.forEach(function(k) {
    if (handled.indexOf(k) === -1) {
      // remove meta from document
      const metaEl = dynamicMeta.filter(function(el) {
        el.name === k;
      })[0];
      document.head.removeChild(metaEl);
    }
  });
}

export function Router(config, defaultMeta) {
  config.forEach(function(route) {
    route.meta = Object.assign({}, defaultMeta, route.meta);
  });
  return {
    match: function(pathname) {
      var match;
      var meta;
      var component;
      var params = {};

      for (var i = 0; i < config.length && !match; i++) {
        var route = config[i].path;
        var keys = [];
        pathname.replace(
          RegExp(
            route === "*"
              ? ".*"
              : "^" +
                route
                  .replace(/\//g, "\\/")
                  .replace(/:([\w]+)/g, function(_, key) {
                    keys.push(key);
                    return "([-\\.%\\w\\(\\)]+)";
                  }) +
                "/?$",
            "g"
          ),
          function() {
            for (var j = 1; j < arguments.length - 2; ) {
              var value = arguments[j++];
              try {
                value = decodeURIComponent(value);
              } catch (_) {} // eslint-disable-line
              params[keys.shift()] = value;
            }

            match = route;
            component = config[i].component;
            meta = config[i].meta;
          }
        );
      }

      return {
        pathname,
        match,
        meta,
        component,
        params
      };
    }
  };
}
