import test from "ava";
import { h, app } from "hyperapp";
import { router, routerApp } from "../src/router";

require("undom/register");

global.window = { location: {} };
window.requestAnimationFrame = setTimeout;
const handlers = {};
global.addEventListener = (name, fn) => {
  handlers[name] = fn;
};
Object.defineProperty(window.location, "pathname", {
  writable: true
});

test.beforeEach(t => {
  document.body.innerHTML = "";
  window.location.pathname = "/";
  window.location.search = "";
  global.location = window.location;
  global.history = {};
  Object.keys(handlers).forEach(key => {
    delete handlers[key];
  });
});

test("router actions should be available with HOA applied", t => {
  app(
    routerApp({
      hooks: [
        (state, actions) => {
          t.is(typeof actions.router.go === "function", true);
          t.is(typeof actions.router.set === "function", true);
        }
      ]
    })
  );
});

test("set should properly set state.router.path", t => {
  const r = router();
  app({
    state: {
      router: r.state
    },
    actions: {
      router: r.actions
    },
    hooks: [
      function() {
        return function() {
          return function(data) {
            return function(update) {
              t.deepEqual(data, {
                router: {
                  path: "/test"
                }
              });
              update(data);
            };
          };
        };
      },
      function(state, actions) {
        actions.router.set({ path: "/test" });
      }
    ]
  });
});

test("go should properly trigger set when pathname changed", t => {
  location.pathname = "/";
  location.search = "";

  let pushStateCount = 0;
  let lastPath;
  history.pushState = (state, title, path) => {
    lastPath = path;
    pushStateCount++;
  };

  const r = router();
  let updateCount = 0;
  const appActions = app({
    state: {
      router: r.state
    },
    actions: {
      router: {
        go: (state, actions, data) => {
          updateCount++;
          r.actions.go(state, actions, data);
        },
        set: r.actions.set
      }
    },
    hooks: r.hooks
  });
  appActions.router.go("/");
  t.is(updateCount, 1);
  t.is(pushStateCount, 0);

  appActions.router.go("/home");
  t.is(updateCount, 2);
  t.is(pushStateCount, 1);
  t.is(lastPath, "/home");
});

test("simulate popstate browser event", t => {
  const r = router();
  const appActions = app({
    state: {
      router: r.state
    },
    actions: {
      router: r.actions,
      test(state, actions) {
        t.is(state.router.path, "/test");
      }
    },
    hooks: [].concat(r.hooks)
  });
  location.pathname = "/test";
  location.search = "";
  handlers["popstate"]();
  appActions.test();
});
