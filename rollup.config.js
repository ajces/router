import babel from "rollup-plugin-babel";

export default {
  input: "./src/index.js",
  name: "router",
  output: {
    file: "./dist/router.js",
    format: "umd"
  },
  sourcemap: true,
  plugins: [
    babel({
      babelrc: false,
      presets: [["es2015", { modules: false }]],
      plugins: []
    })
  ],
  globals: {},
  external: []
};
