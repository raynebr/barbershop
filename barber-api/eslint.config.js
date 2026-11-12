import js from '@eslint/js';

export default [
  { ignores: ['node_modules', 'dist', 'prisma/migrations'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: 'module',
    },
    plugins: {
      // adicionar plugins se necessário
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];