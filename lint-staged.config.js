export default {
  '*.{js,jsx,ts,tsx}': [() => 'pnpm run generate-schemas',  'tsc --noEmit', 'jest --passWithNoTests', 'pnpm run lint'],
};
