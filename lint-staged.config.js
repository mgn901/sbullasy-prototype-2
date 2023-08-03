export default {
  '*.{js,jsx,ts,tsx}': [() => 'tsc --noEmit', 'jest --passWithNoTests', 'pnpm run lint'],
};
