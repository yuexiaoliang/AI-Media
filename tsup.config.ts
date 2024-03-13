import { defineConfig } from 'tsup';

import path from 'path';
import { spawnSync } from 'child_process';
import { copy } from 'esbuild-plugin-copy';
import yargs from 'yargs-parser';
import { rimrafSync } from 'rimraf';

const argvRaw = process.argv.slice(2);
const argv = yargs(argvRaw);

let tempBuilded = false;
const entryPoints = [path.resolve(__dirname, './index.ts')];
const outdir = './dist/';
const outfile = outdir + 'index.cjs';

const buildStart = {
  name: 'build-start',
  setup(build) {
    build.onStart(() => {
      if (!tempBuilded) {
        rimrafSync(`${outdir}/html-templates`);

        spawnSync('pnpm', ['build:html'], { stdio: 'inherit', shell: true });

        tempBuilded = true;
      }
    });
  }
};

const buildEnd = {
  name: 'build-end',
  setup(build) {
    build.onEnd(() => {
      spawnSync('node', [outfile, ...argvRaw], { stdio: 'inherit' });
    });
  }
};

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  splitting: true,
  sourcemap: true,
  // clean: true,
  // minify: true,
  noExternal: [/.*\@auto\-blog.*/],
  dts: false,

  format: ['cjs', 'esm'],


  // esbuildPlugins: [
  //   copy({
  //     resolveFrom: 'cwd',
  //     assets: [{ from: './html-templates/dist/**/*', to: './dist/html-templates' }]
  //   }),
  //   buildStart,
  //   buildEnd
  // ],

  // esbuildOptions(options, context) {
    // const o = {
      // entryPoints,
      // platform: 'node',
      // bundle: true,
      // assetNames: 'assets/[name]-[hash]',
      // loader: { '.txt': 'text', '.css': 'text', '.html': 'text' }
    // };

    // Object.entries(o).forEach(([key, value]) => {
    //   options[key] = value;
    // });
  // }
});
