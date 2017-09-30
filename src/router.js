export function router() {
  return {
    state: {
      path: location.pathname + location.search
    },
    actions: {
      set: function(state, actions, data) {
        return data;
      },
      go: function(state, actions, path) {
        if (location.pathname + location.search !== path) {
          history.pushState({}, "", path);
          actions.set({
            path: path
          });
        }
      }
    },
    hook: function(state, actions) {
      addEventListener("popstate", function(event) {
        actions.router.set({ path: location.pathname + location.search });
      });
    }
  };
}
