# AJCES router fork of @hyperapp/router
The main difference being the addition of meta tag diffing on route changes, using array of route objects [{path, view, meta}] instead of array of arrays which I feel is clearer in the code and I will also be adding async routing soon via an async view helper function which will provide functionality similar to react-loadable...

The defaultMeta provided to the Router mixin will allow defaults for routes that choose not to specify a meta value, anything supplied to a route meta object will be merged with defaultMeta via Object.assign({}, defaultMeta, view.meta)

There are meta tags that cause bugs in certain browsers if modified after page load, these are skipped in our meta dom diff to avoid issues: origin, referrer, viewport. ( any other key value pair should work in the meta object )

```jsx
import { Router, Link } from "@ajces/router"

app({
  view: [
    {
      path: "/",
      view: (state, actions) =>
        <Link to="/test" go={actions.router.go}>
          Test
        </Link>,
      meta: {
        title: "Idiom - Router",
        description: "SEO description for Idiom Router"
      }
    },
    {
      path: "/test",
      view: (state, actions) =>
        <Link to="/" go={actions.router.go}>
          Back
        </Link>,
      meta: {
        title: "Test",
        description: "SEO test",
        keywords: "comma,delimited,list"
      }
    }
  ],
  mixins: [Router({
    title: "AJCES - Router",
    description: "AJCES customized fork of @hyperapp/router",
    author: "Andy Johnson",
    keywords: "idiom,router,hyperapp,meta,async"
  })]
})
```

## License

@ajces/router is MIT licensed. See [LICENSE](LICENSE.md).

