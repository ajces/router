import { h } from "hyperapp";

import { Matcher } from "./matcher";
// <Router meta={defaultMeta} pathname={router.path}, updateMeta={updateMeta}}>...</Router>
let router; // simplify and just have 1 router for now...
export function Router({ meta, pathname, updateMeta }, children) {
  if (router === undefined) {
    router = Matcher(children, meta);
  }
  const match = router.match(pathname);
  if (
    match.meta !== undefined &&
    match.meta !== {} &&
    updateMeta !== undefined
  ) {
    updateMeta(match.meta);
  }
  return match.component(match.params);
}

// <Route path="/" component={Home} meta={HomeMeta} />
export function Route({ path, component, meta }) {
  return { path, component, meta };
}

// <Link to="/">...</Link>
export function Link(props, children) {
  props.href = props.to;
  props.to = null;

  props.onclick = function(event) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      props.target === "_blank" ||
      event.currentTarget.origin !== window.location.origin
    ) {
      return;
    }

    event.preventDefault();
    props.go(props.href);
  };

  return h("a", props, children);
}
