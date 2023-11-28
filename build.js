import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import yargs from 'yargs-parser';
import { rimrafSync } from 'rimraf'

const argv = yargs(process.argv.slice(2))

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const entryPoints = [path.resolve(__dirname, './src/index.ts')];
const outdir = './dist/';
const outfile = outdir + 'index.cjs';

const buildEnd = {
  name: 'build-end',
  setup(build) {
    build.onEnd(() => {
      spawnSync('node', [outfile], { stdio: 'inherit' });
    });
  }
};

const esbuildOptions = {
  entryPoints,
  platform: 'node',
  outfile,
  bundle: true,
  minify: !argv.watch,
  assetNames: 'assets/[name]-[hash]',
  loader: { '.txt': 'text', '.css': 'text', '.html': 'text' },
  alias: {
    '@constants': './src/constants',
    '@libraries': './src/libraries',
    '@openai': './src/openai',
    '@utils': './src/utils',
    '@database': './src/database',
    "@publishers": "./src/publishers",
    "@md-renders": "./src/md-renders",
    "@cover": "./src/cover",
  },
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [
        { from: './src/html-templates/**/*', to: './dist/html-templates' },
      ],
    }),
  ]
}

if (argv.watch) {
  // rimrafSync(outdir)
  rimrafSync(`${outdir}/html-templates`)
  let ctx = await esbuild.context({
    ...esbuildOptions,
    plugins: [...esbuildOptions.plugins, buildEnd],
  })
  ctx.watch()
} else {
  // rimrafSync(outdir)
  rimrafSync(`${outdir}/html-templates`)
  const opts = { ...esbuildOptions };

  if (argv.run) {
    opts.plugins = [...esbuildOptions.plugins, buildEnd]
  }
  esbuild.build(opts)
}

