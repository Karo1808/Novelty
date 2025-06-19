// eslint.config.js
import antfu from '@antfu/eslint-config'
import turbo from 'eslint-config-turbo/flat'
import drizzle from 'eslint-plugin-drizzle'
import oxlint from 'eslint-plugin-oxlint'
import importPlugin from 'eslint-plugin-import'

export default antfu(
  // 1) Antfu “options” go here:
  {
    type: 'app',               // 'app' or 'lib'
    lessOpinionated: true,     
    typescript: true,          
    formatters: true,          
    stylistic: { 
      indent: 2,
      semi: true,
      quotes: 'double',
    },
    ignores: [
      '**/migrations/**',
      '**/*.yml',
      '**/*.yaml',
      '**/*.md',
      '**/routeTree.*',
      '**/.output/**',
      '**/.nitro/**',
      '**/tanstack/**',
    ],
  },

  // 2) Flat configs/plugins as separate args:
  turbo,                      // eslint-config-turbo’s flat export
  drizzle,                    // eslint-plugin-drizzle
  {                           // Register import plugin under the name “import”
    plugins: { 
      import: importPlugin 
    },
  },
  ...oxlint.configs['flat/all'],  // Oxlint’s “all” flat config :contentReference[oaicite:0]{index=0}

  // 3) Finally, your bespoke rule overrides:
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'no-console': 'warn',
      'antfu/no-top-level-await': 'off',
      'node/prefer-global/process': 'off',
      'node/no-process-env': 'error',
      'unicorn/filename-case': [
        'error',
        { case: 'kebabCase', ignore: ['README.md', '**/routeTree.*'] },
      ],
    },
  },
)
