/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['text'],
};

module.exports = config;
