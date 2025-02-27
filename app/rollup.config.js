import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import eslint from '@rbnlffl/rollup-plugin-eslint';
import includePaths from 'rollup-plugin-includepaths';
import { string } from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import analyze from 'rollup-plugin-analyzer';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
    inlineDynamicImports: true
  },
  plugins: [
    includePaths({
      include: {},
      paths: ['./'],
      external: [],
      extensions: ['.ts', '.json', '.svelte']
    }),
    eslint({
      filterInclude: "src/**/*.(ts|svelte|js)"
    }),
    replace({
      preventAssignment: true,
      values: {
        'ROLLUP_IS_DEV': !production
      }
    }),
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),
    json(),
    image({
      include: "src/assets/**/*"
    }),
    string({
      include: "src/svg/**/*.svg",
    }),
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    production && analyze()
  ],
  watch: {
    clearScreen: false
  }
};
