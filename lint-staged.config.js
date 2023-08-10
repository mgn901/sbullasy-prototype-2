export default {
  '*.{js,jsx,ts,tsx}': [
    () => 'pnpm run generate-schemas',
    () => 'tsc -p tsconfig.json --noEmit',
    'jest --passWithNoTests',
    'pnpm run lint',
  ],
};
