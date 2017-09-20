# AJCES router
This is forked from hyperapp/router and extracts the match logic into a framework agnostic router.  Addition handling of meta tag diffing on route changes, has also been added, using array of route objects [{path, view, meta}] instead of array of arrays which I feel is clearer in the code.

The defaultMeta provided to the Router will allow defaults for routes that choose not to specify a meta value, anything supplied to a route meta object will be merged with defaultMeta via Object.assign({}, defaultMeta, view.meta)

There are meta tags that cause bugs in certain browsers if modified after page load, these are skipped in our meta diff to avoid issues: origin, referrer, viewport. ( any other key value pair should work in the meta object )

```js
```

## License

@ajces/router is MIT licensed. See [LICENSE](LICENSE.md).
