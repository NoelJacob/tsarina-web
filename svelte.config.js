import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import {optimizeImports, elements} from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    optimizeImports(),
    preprocess({
      // sass: {loadPaths: ["node_modules"]},
      postcss: true,
    }),
  ],
  kit: {
    adapter: adapter(),
    vite: {
      optimizeDeps: {
        exclude: ["@babichjacob/svelte-localstorage"],
      },
    },
  },
};

export default config;
