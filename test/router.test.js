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
  app(
    routerApp({
      hooks: [
        (state, actions) => {
          console.log("load");
          actions.router.set({ path: "/test" });
          return function(info) {
            console.log("why the fuck does this never get called?");
            console.log("action");
            return function() {
              console.log("resolve");
              return function(data) {
                console.log(data);
                t.deepEqual(data, {
                  router: {
                    path: "/test"
                  }
                });
              };
            };
          };
        }
      ]
    })
  );
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

  let updateCount = 0;
  const appActions = app({
    actions: {
      router: router.actions
    },
    hooks: [
      function() {
        return function() {
          return function() {
            return function(data) {
              updateCount++;
            };
          };
        };
      }
    ]
  });

  appActions.router.go("/");
  t.is(updateCount, 0);
  t.is(pushStateCount, 0);

  appActions.router.go("/home");
  t.is(updateCount, 1);
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
