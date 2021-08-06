// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outdir: 'lib',
    bundle: true,
    minify: true,
    platform: 'browser',
    sourcemap: true,
    format: 'esm',
    target: ['esnext'],
  })
  .catch(() => process.exit(1));
