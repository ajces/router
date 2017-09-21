export function router(options) {
  return function(emit) {
    return {
      state: {
        router: {}
      },
      actions: {
        router: {
          set: function(state, actions, data) {
            return {
              router: data
            };
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
          });
        }
      }
    };
  };
}
