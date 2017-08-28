export function router(defaultMeta) {
  if (defaultMeta == null) {
    defaultMeta = {};
  }

  return function (emit) { 
    return {
      state: {
        router: {}
      },
      actions: {
        router: {
          set: function(state, actions, data) {
            if (data.meta != null) {
              updateMeta(data.meta);
            }
            return {
              router: data
            }
          },
          go: function(state, actions, path) {
            if (location.pathname + location.search !== path) {
              history.pushState({}, "", path);
              actions.router.set({
                path: path
              });
            }
          }
        }
      },
      events: {
        load: function(state, actions) {
          addEventListener("popstate", function() {
            actions.router.set({});
          })
        },
        render: function(state, actions, view) {
          return view[
            (state.router.index >= 0
              ? state
              : actions.router.set(emit("route", match(location.pathname, view))))
              .router.index
          ].view;
        }
      }
    }
  }

  function updateMeta(meta) {
    if (document.getElementsByTagName == null) {
      window.meta = meta; // hack work around for SSR...
    } else {
      document.title = meta.title;
      var dynamicMeta = [].filter.call(
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
      var keys = Object.keys(meta).filter(function(k) { k !== "title" });
      var handled = [];
      keys.forEach(function(k) {
        var metaEl = dynamicMeta.filter(function (el) { el.name === k })[0];
        if (metaEl === undefined) {
          // add missing meta element to head
          var newMeta = document.createElement("meta");
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
          var metaEl = dynamicMeta.filter(function (el) { el.name === k })[0];
          document.head.removeChild(metaEl);
        }
      });
    }
  }

  function match(pathname, routes) {
    var match;
    var meta;
    var index;
    var params = {};

    for (var i = 0; i < routes.length && !match; i++) {
      var route = routes[i].path;
      var keys = [];
      pathname.replace(
        RegExp(
          route === "*"
            ? ".*"
            : "^" +
              route.replace(/\//g, "\\/").replace(/:([\w]+)/g, function(_, key) {
                keys.push(key)
                return "([-\\.%\\w\\(\\)]+)"
              }) +
              "/?$",
          "g"
        ),
        function() {
          for (var j = 1; j < arguments.length - 2; ) {
            var value = arguments[j++];
            try {
              value = decodeURI(value);
            } catch (_) {}
            params[keys.shift()] = value;
          }

          match = route;
          index = i;
          meta = Object.assign({}, defaultMeta, routes[i].meta);
        }
      );
    }

    return {
      meta: meta,
      match: match,
      index: index,
      params: params
    };
  }
}