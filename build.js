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

let tempBuilded = false
const entryPoints = [path.resolve(__dirname, './index.ts')];
const outdir = './dist/';
const outfile = outdir + 'index.cjs';

const buildStart = {
  name: 'build-start',
  setup(build) {
    build.onStart(() => {
      if (!tempBuilded) {
        rimrafSync(`${outdir}/html-templates`)

        spawnSync('pnpm', ['build:html'], { stdio: 'inherit', shell: true });

        tempBuilded = true
      }
    });
  }
}

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
        { from: './html-templates/dist/**/*', to: './dist/html-templates' },
      ],
    }),
    buildStart,
    buildEnd
  ]
}

if (argv.watch) {

  let ctx = await esbuild.context({
    ...esbuildOptions,
    plugins: [...esbuildOptions.plugins,],
  })

  ctx.watch()
} else {

  const opts = { ...esbuildOptions, minify: true };

  if (argv.run) {
    opts.plugins = [...esbuildOptions.plugins]
  }

  esbuild.build(opts)
}

