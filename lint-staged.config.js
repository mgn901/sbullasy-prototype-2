module.exports = {
  '*.{js,jsx,ts,tsx}': [
    () => 'tsc --noEmit',
    'jest --passWithNoTests',
    'eslint --fix',
  ],
};
