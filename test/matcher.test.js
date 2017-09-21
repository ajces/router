import test from "ava";
import { Matcher } from "../src/matcher";

const defaultMeta = { keywords: "one, two, three" };
const config = [
  {
    path: "/",
    component: { name: "Home" },
    meta: { title: "Home" }
  },
  {
    path: "/about",
    component: { name: "About" },
    meta: { title: "About" }
  },
  {
    path: "/profile/:user",
    component: { name: "Profile" },
    meta: { title: "Profile" }
  },
  {
    path: "*",
    component: { name: "Error" },
    meta: { title: "404" }
  }
];

test("matcher should return proper route object", t => {
  const matcher = Matcher(config, defaultMeta);
  t.deepEqual(matcher.match("/"), {
    match: "/",
    component: { name: "Home" },
    meta: {
      title: "Home",
      keywords: "one, two, three"
    },
    params: {}
  });

  t.deepEqual(matcher.match("/about"), {
    match: "/about",
    component: { name: "About" },
    meta: {
      title: "About",
      keywords: "one, two, three"
    },
    params: {}
  });

  t.deepEqual(matcher.match("/profile/andy"), {
    match: "/profile/:user",
    component: { name: "Profile" },
    meta: {
      title: "Profile",
      keywords: "one, two, three"
    },
    params: { user: "andy" }
  });

  t.deepEqual(matcher.match("/404"), {
    match: "*",
    component: { name: "Error" },
    meta: {
      title: "404",
      keywords: "one, two, three"
    },
    params: {}
  });
});
