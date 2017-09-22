# AJCES router
This is forked from hyperapp/router and extracts the match logic into a framework agnostic router.  Addition handling of meta tag diffing on route changes, has also been added, using array of route objects [{path, view, meta}] instead of array of arrays which I feel is clearer in the code.

The defaultMeta provided to the Router will allow defaults for routes that choose not to specify a meta value, anything supplied to a route meta object will be merged with defaultMeta via Object.assign({}, defaultMeta, match.meta)

There are meta tags that cause bugs in certain browsers if modified after page load, these are skipped in our meta diff to avoid issues: origin, referrer, viewport. ( any other key value pair should work in the meta object )

```jsx
import { h, app } from "hyperapp";
import { router, updateMeta, Link, Router, Route } from "@ajces/router";
import { Header, Nav, Footer, About, Profile } from "./components";

app({
  state: { count: 0 },
  view: (state, actions) => (
    <div>
      <Header />
      <Nav />
      <Router 
        meta={
          title: "Hyperapp Meta Router!",
          description: "hyperapp componad based routing experiment",
          keywords: "hyperapp, routing, router, meta",
          author: "Andy Johnson"
        }
        pathname={state.router.path}
        updateMeta={updateMeta}
      >
        <Route path="/" meta={params => ({ title: "Home" })} component={props => (
          <div>
            <h1>
              {"HOME!"}
            </h1>
            <Link to="/about" go={actions.router.go} />
            <Link to="/profile/andy" go={actions.router.go} />
          </div>
        )} />
        <Route path="/about" component={About} />
        <Route path="/profile/:user" meta={params => ({ title: `Profile - ${params.user}` })} component={Profile} />
      </Router>
      <Footer />
    </div>
  ),
  mixins: [router()]
});
```

## License

@ajces/router is MIT licensed. See [LICENSE](LICENSE.md).
