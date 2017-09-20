import minify from "rollup-plugin-babel-minify";

export default {
  input: "./src/index.js",
  name: "router",
  output: {
    file: "./dist/router.js",
    format: "umd"
  },
  sourcemap: true,
  plugins: [minify({ comments: false })],
  globals: {},
  external: []
};
