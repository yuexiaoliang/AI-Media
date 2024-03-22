import { defineConfig } from 'tsup';
import { spawnSync } from 'child_process';
import { copy } from 'esbuild-plugin-copy';

let tempBuilded = false;

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  noExternal: [/.*\@auto\-blog.*/],
  sourcemap: true,
  clean: false,
  minify: true,
  format: 'esm',
  loader: { '.txt': 'text', '.css': 'text', '.html': 'text' },

  esbuildPlugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [{ from: './html-templates/dist/**/*', to: './dist/html-templates' }]
    }),
    {
      name: 'build-start',
      setup(build) {
        build.onStart(() => {
          if (!tempBuilded) {
            spawnSync('pnpm', ['build:html'], { stdio: 'inherit', shell: true });

            tempBuilded = true;
          }
        });
      }
    }
  ]
});
