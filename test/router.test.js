import test from "ava";
import { h, app } from "hyperapp";
import { router } from "../src/router";

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

test("router actions should be available with mixin applied", t => {
  app({
    events: {
      load: (state, actions) => {
        t.is(typeof actions.router.go === "function", true);
        t.is(typeof actions.router.set === "function", true);
      }
    },
    mixins: [router()]
  });
});

test("set should properly set state.router.path", t => {
  app({
    events: {
      load: (state, actions) => {
        actions.router.set({ path: "/test" });
      },
      update: (state, actions, data) => {
        t.deepEqual(data, {
          router: {
            path: "/test"
          }
        });
      }
    },
    mixins: [router()]
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

  let updateCount = 0;
  const emit = app({
    events: {
      update: (state, actions, data) => {
        updateCount++;
      },
      go: (state, actions, path) => {
        actions.router.go(path);
      }
    },
    mixins: [router()]
  });

  emit("go", "/");
  t.is(updateCount, 0);
  t.is(pushStateCount, 0);

  emit("go", "/home");
  t.is(updateCount, 1);
  t.is(pushStateCount, 1);
  t.is(lastPath, "/home");
});

test("simulate popstate browser event", t => {
  const emit = app({
    events: {
      test: (state, actions) => {
        t.is(state.router.path, "/test");
      }
    },
    mixins: [router()]
  });
  location.pathname = "/test";
  location.search = "";
  handlers["popstate"]();
  emit("test");
});

/*
test("/", done => {
  app({
    view: [
      [
        "/",
        state =>
          h(
            "div",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(`<div>foo</div>`)
                done()
              }
            },
            "foo"
          )
      ]
    ],
    mixins: [Router]
  })
})

test("*", done => {
  location.pathname = "/foo"

  app({
    view: [
      [
        "*",
        (state, actions) =>
          h(
            "div",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(`<div>foo</div>`)
                actions.router.go("/bar")
              },
              onupdate() {
                expect(document.body.innerHTML).toBe(`<div>foo</div>`)
                done()
              }
            },
            "foo"
          )
      ]
    ],
    mixins: [Router]
  })
})

test("routes", done => {
  window.location.pathname = "/foo/bar/baz"

  app({
    view: [
      [
        "/foo/bar/baz",
        state =>
          h(
            "div",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(`<div>foobarbaz</div>`)
                done()
              }
            },
            "foo",
            "bar",
            "baz"
          )
      ]
    ],
    mixins: [Router]
  })
})

test("route params", done => {
  window.location.pathname = "/be_ep/bOp/b00p"

  app({
    view: [
      [
        "/:foo/:bar/:baz",
        state =>
          h(
            "ul",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(
                  `<ul><li>foo:be_ep</li><li>bar:bOp</li><li>baz:b00p</li></ul>`
                )
                done()
              }
            },
            Object.keys(state.router.params).map(key =>
              h("li", {}, `${key}:${state.router.params[key]}`)
            )
          )
      ]
    ],
    mixins: [Router]
  })
})

test("route params separated by a dash", done => {
  window.location.pathname = "/beep-bop-boop"

  app({
    view: [
      [
        "/:foo-:bar-:baz",
        state =>
          h(
            "ul",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(
                  `<ul><li>foo:beep</li><li>bar:bop</li><li>baz:boop</li></ul>`
                )
                done()
              }
            },
            Object.keys(state.router.params).map(key =>
              h("li", {}, `${key}:${state.router.params[key]}`)
            )
          )
      ]
    ],
    mixins: [Router]
  })
})

test("route params including a dot", done => {
  window.location.pathname = "/beep/bop.bop/boop"

  app({
    view: [
      [
        "/:foo/:bar/:baz",
        state =>
          h(
            "ul",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(
                  `<ul><li>foo:beep</li><li>bar:bop.bop</li><li>baz:boop</li></ul>`
                )
                done()
              }
            },
            Object.keys(state.router.params).map(key =>
              h("li", {}, `${key}:${state.router.params[key]}`)
            )
          )
      ]
    ],
    mixins: [Router]
  })
})

test("routes params with a dash in key", done => {
  window.location.pathname = "/beep-bop-boop"

  app({
    view: [
      [
        "/:foo",
        state =>
          h(
            "div",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(`<div>beep-bop-boop</div>`)
                done()
              }
            },
            state.router.params.foo
          )
      ]
    ],
    mixins: [Router]
  })
})

test("route params with uri encoded string & parentheses ", done => {
  window.location.pathname = "/Batman%20(1989%20film)"
  app({
    view: [
      [
        "/:foo",
        state =>
          h(
            "div",
            {
              oncreate() {
                expect(document.body.innerHTML).toBe(
                  `<div>Batman (1989 film)</div>`
                )
                done()
              }
            },
            state.router.params.foo
          )
      ]
    ],
    mixins: [Router]
  })
})

test("popstate", done => {
  const view = name =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe(`<div>${name}</div>`)

          const event = document.createEvent("Event")
          event.initEvent("popstate", true, true)

          window.location.pathname = `/foo`
          window.document.dispatchEvent(event)
        },
        onupdate() {
          expect(document.body.innerHTML).toBe(`<div>${name}</div>`)
          done()
        }
      },
      name
    )

  app({
    view: [["/", () => view("")], ["/foo", () => view("foo")]],
    mixins: [Router]
  })
})

test("go", done => {
  app({
    view: [
      [
        "/",
        (state, actions) =>
          h("div", {
            oncreate() {
              expect(document.body.innerHTML).toBe("<div></div>")
              actions.router.go("/foo")
            }
          })
      ],
      [
        "/foo",
        (state, actions) =>
          h(
            "div",
            {
              onupdate() {
                expect(document.body.innerHTML).toBe("<div>foo</div>")
                actions.router.go("/bar")
              }
            },
            "foo"
          )
      ],
      [
        "/bar",
        (state, actions) =>
          h(
            "div",
            {
              onupdate() {
                expect(document.body.innerHTML).toBe("<div>bar</div>")
                actions.router.go("/baz")
              }
            },
            "bar"
          )
      ],
      [
        "/baz",
        (state, actions) =>
          h(
            "div",
            {
              onupdate() {
                expect(document.body.innerHTML).toBe("<div>baz</div>")
                done()
              }
            },
            "baz"
          )
      ]
    ],
    mixins: [Router]
  })
})

test("route", done => {
  app({
    events: {
      route(state, actions, route) {
        expect(route.match).toBe("/")
        done()
      }
    },
    view: [["/", (state, actions) => h("div", {}, "foo")]],
    mixins: [Router]
  })
})

test("do not fire route for unrelated state updates", done => {
  app({
    state: {
      value: "foo"
    },
    actions: {
      bar() {
        return {
          value: "bar"
        }
      }
    },
    events: {
      route(state, actions, route) {
        expect(state.value).toBe("foo")
      }
    },
    view: [
      [
        "/",
        (state, actions) =>
          h(
            "div",
            {
              oncreate() {
                actions.bar()
              },
              onupdate() {
                done()
              }
            },
            "foo"
          )
      ]
    ],
    mixins: [Router]
  })
})

test("fire route only if path changes", done => {
  app({
    state: {
      value: "foo"
    },
    actions: {
      bar() {
        return {
          value: "bar"
        }
      }
    },
    events: {
      route(state, actions, route) {
        expect(state.value).toBe("foo")
      }
    },
    view: [
      [
        "/",
        (state, actions) =>
          h(
            "div",
            {
              oncreate() {
                actions.bar()
                actions.router.go("/")
              },
              onupdate() {
                done()
              }
            },
            "foo"
          )
      ]
    ],
    mixins: [Router]
  })
})
*/
