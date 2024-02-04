import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import yargs from 'yargs-parser';
import { rimrafSync } from 'rimraf'

const argvRaw = process.argv.slice(2)
const argv = yargs(argvRaw)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const entryPoints = [path.resolve(__dirname, './index.ts')];
const outdir = './dist/';
const outfile = outdir + 'index.cjs';

const buildEnd = {
  name: 'build-end',
  setup(build) {
    build.onEnd(() => {
      spawnSync('node', [outfile, ...argvRaw], { stdio: 'inherit' });
    });
  }
};

const esbuildOptions = {
  entryPoints,
  platform: 'node',
  outfile,
  bundle: true,
  assetNames: 'assets/[name]-[hash]',
  loader: { '.txt': 'text', '.css': 'text', '.html': 'text' },
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [
        { from: './html-templates/**/*', to: './dist/html-templates' },
      ],
    }),
  ]
}

if (argv.watch) {
  rimrafSync(`${outdir}/html-templates`)

  let ctx = await esbuild.context({
    ...esbuildOptions,
    plugins: [...esbuildOptions.plugins, buildEnd],
  })

  ctx.watch()
} else {
  rimrafSync(`${outdir}/html-templates`)

  const opts = { ...esbuildOptions, minify: true};

  if (argv.run) {
    opts.plugins = [...esbuildOptions.plugins, buildEnd]
  }

  esbuild.build(opts)
}

