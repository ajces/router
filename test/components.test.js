import test from "ava";
import { Router, Route, Link } from "../src/components";

test("Route should return valid match object", t => {
  const expected = { path: "/", component: {}, meta: { title: "meta" } };
  t.deepEqual(
    Route({ path: "/", component: {}, meta: { title: "meta" } }),
    expected
  );
});
