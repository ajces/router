import { h } from "hyperapp";

import { Matcher, updateMeta } from "./matcher";
// <Router name="root" meta={defaultMeta} statePath={[path, to, pathname], state={state}}>...</Router>
const routers = {}; // so a page can have multiple routers...  non-nested...?
export function Router({ name, meta, pathname }, children) {
  if (routers[name] === undefined) {
    routers[name] = Matcher(children, meta);
  }
  const match = routers[name].match(pathname);
  if (match.meta !== {}) {
    updateMeta(match.meta);
  }
  return match.component(match.params);
}

// <Route path="/" component={Home} meta={HomeMeta} />
export function Route({ path, component, meta }) {
  meta = meta || {};
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
