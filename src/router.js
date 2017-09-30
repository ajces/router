export function router() {
  return {
    state: { path: location.pathname },
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
    hooks: [
      function(state, actions) {
        addEventListener("popstate", function(event) {
          actions.router.set({ path: location.pathname + location.search });
        });
      }
    ]
  };
};

export function routerApp(props) {
  var r = router();
  if (props.hooks !== undefined) {
    props.hooks.concat(r.hooks);
  } else {
    props.hooks = r.hooks;
  }

  if (props.state !== undefined) {
    if (props.state.router === undefined) {
      props.state.router = r.state;
    }
  } else {
    props.state = {
      router: r.state
    };
  }

  if (props.actions === undefined) {
    props.actions = { router: r.actions };
  } else {
    props.actions.router = r.actions;
  }

  return props;
}
