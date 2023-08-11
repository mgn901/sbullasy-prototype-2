/* eslint-disable import/no-extraneous-dependencies */

import { cpSync, existsSync } from 'fs';
import { createRequire } from 'module';
import autoprefixer from 'autoprefixer';
import esbuild, { BuildOptions } from 'esbuild';
import stylePlugin from 'esbuild-style-plugin';
import tailwindcss, { Config } from 'tailwindcss';

const require = createRequire(import.meta.url);
const tailwindConfig = require('../tailwind.config.cjs') as unknown as Config;
const packageJSON = require('../package.json') as unknown as Record<string, any>;

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const APP_VERSION = process.env.APP_VERSION ?? (packageJSON.version as string) ?? '1.0.0';
const isDev = NODE_ENV === 'development';
const outDir = NODE_ENV;

const optionsClient: BuildOptions = {
  entryPoints: [
    'src/client/index.tsx',
    // 'src/client/serviceWorker.ts',
  ],
  outdir: `${outDir}/client`,
  assetNames: 'assets/[name]',
  chunkNames: '[name]',
  loader: {
    '.woff': 'file',
    '.woff2': 'file',
  },
  platform: 'browser',
  format: 'iife',
  bundle: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.APP_VERSION': JSON.stringify(APP_VERSION),
  },
  minify: !isDev,
  sourcemap: isDev,
  target: ['chrome98', 'firefox97', 'edge98', 'safari14'],
  plugins: [
    stylePlugin({
      postcss: {
        plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      },
    }),
  ],
};

const optionsServer: esbuild.BuildOptions = {
  entryPoints: ['src/server/index.ts'],
  outdir: `${outDir}/server`,
  platform: 'node',
  format: 'esm',
  bundle: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  },
  minify: !isDev,
  sourcemap: isDev,
  target: ['node18'],
  banner: {
    js: `const require = (await import("node:module")).createRequire(import.meta.url);const __filename = (await import("node:url")).fileURLToPath(import.meta.url);const __dirname = (await import("node:path")).dirname(__filename);`,
  },
};

const start = () => {
  esbuild.build(optionsClient);
  esbuild.build(optionsServer);
  if (existsSync('src/client/static')) {
    cpSync('src/client/static/', `${outDir}/client/`, {
      recursive: true,
      errorOnExist: false,
    });
  }
};

start();
