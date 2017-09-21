import test from "ava";
import { Matcher, updateMeta } from "../src/matcher";

require("undom/register");

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

function buildTestMeta() {
  document.head = document.createElement("head");
  Object.keys(defaultMeta).forEach(key => {
    const newMeta = document.createElement("meta");
    newMeta.setAttribute("name", key);
    newMeta.setAttribute("content", defaultMeta[key]);
    document.head.appendChild(newMeta);
  });
}

document.getElementsByTagName = name => {
  if (name === "meta") {
    return document.head.childNodes;
  } else {
    return undefined;
  }
};

function testMeta(t, expected) {
  document.head.childNodes.forEach(node => {
    let name = node.name;
    let content = node.content;
    t.is(content, expected[name]);
  });
}

test("updateMeta should properly diff/patch meta tags...", t => {
  buildTestMeta();
  testMeta(t, defaultMeta);
  const changedMeta = {
    author: "Andy Johnson",
    keywords: "a b c"
  };
  updateMeta(changedMeta);
  testMeta(t, changedMeta);
  const removeMeta = {
    author: "Jon Doe"
  };
  updateMeta(removeMeta);
  testMeta(t, removeMeta);
  const invalidMeta = {
    origin: "bam",
    referrer: "pow",
    viewport: "bang"
  };
  updateMeta(removeMeta);
  testMeta(t, removeMeta);
  updateMeta({});
  testMeta(t, {});
});

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
