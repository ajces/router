import { h } from "hyperapp";
import { Matcher } from "./matcher";

// <Router meta={defaultMeta} pathname={router.path}, updateMeta={updateMeta}}>...</Router>
export function Router({ meta, pathname, updateMeta }, children) {
  const flatChildren = children.reduce((a, b) => a.concat(b), []);
  const match = Matcher(flatChildren, meta).match(pathname);
  if (
    match.meta !== undefined &&
    match.meta !== {} &&
    updateMeta !== undefined
  ) {
    updateMeta(match.meta);
  }
  // props for component should be {...match.props, params: match.params}
  return match.component(
    Object.assign({}, match.props, { params: match.params })
  );
}

// <Route path="/" component={Home} meta={HomeMeta} />
export function Route({ path, props, component, meta }, children) {
  const result = [];
  if (component) {
    result.unshift({ path, props, component, meta });
  }
  if (children) {
    const flatChildren = children.reduce((a, b) => a.concat(b), []);
    for (let i = flatChildren.length - 1; i > -1; i--) {
      const child = flatChildren[i];
      child.path = path + child.path;
      result.unshift(child);
    }
  }
  return result;
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
