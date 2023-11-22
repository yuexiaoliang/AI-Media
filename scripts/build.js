import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import esbuild from 'esbuild';
import yargs from 'yargs-parser';
import { replace } from 'esbuild-plugin-replace'

const argv = yargs(process.argv.slice(2))

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outfile = path.resolve(__dirname, '../dist/index.cjs');

const buildEnd = {
  name: 'build-end',
  setup(build) {
    build.onEnd(() => {
      spawnSync('node', [outfile], { stdio: 'inherit' });
    });
  }
};

const esbuildOptions = {
  entryPoints: [path.resolve(__dirname, '../main.ts')],
  outfile,
  platform: 'node',
  bundle: true,
  minify: !argv.watch,
  sourcemap: argv.watch,
  plugins: [replace()]
}

if (argv.watch) {
  let ctx = await esbuild.context({
    ...esbuildOptions,
    plugins: [...esbuildOptions.plugins, buildEnd],
  })
  ctx.watch()
} else {
  esbuild.build(esbuildOptions)
}

