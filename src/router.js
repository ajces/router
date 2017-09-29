export const router = {
  state: {
    router: { path: location.pathname + location.search }
  },
  actions: {
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
  },
  hooks: [
    function(state, actions) {
      addEventListener("popstate", function(event) {
        actions.router.set({ path: location.pathname + location.search });
      });
    }
  ]
};

export function routerApp(props) {
  if (props.hooks !== undefined) {
    props.hooks.concat(router.hooks);
  } else {
    props.hooks = router.hooks;
  }

  if (props.state.router === undefined) {
    props.state.router = router.state;
  }

  if (props.actions === undefined) {
    props.actions = { router: router.actions };
  } else {
    props.actions.router = router.actions;
  }

  return props;
}