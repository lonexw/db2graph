// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.tsx',
  output: {
    file: 'public/bundle.js',
    // immediately-invoked function expression — suitable for <script> tags
    format: 'iife', 
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser() // minify, but only in production
  ]
};