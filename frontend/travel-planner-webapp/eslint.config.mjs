import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import importPlagin from 'eslint-plugin-import';


export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: {
            react: {
                version: 'detect',
            }
        },
        plugins: {
            import: importPlagin,
            'react-hooks': pluginReactHooks,
        },
        rules: {
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                },
            ],
            'react/jsx-indent': [
                'error',
                4,
            ],
            'react/jsx-indent-props': [
                'error',
                4,
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 2,
                },
            ],
            'jsx-quotes': [
                'error',
                'prefer-single',
            ],
            quotes: ['error', 'single'],
            'react-hooks/exhaustive-deps': 'warn',
            'react/react-in-jsx-scope': 'off',
            'import/prefer-default-export': 'off',
            'import/newline-after-import': [
                'error',
                {
                    count: 2,
                },
            ],
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
                    pathGroups: [
                        {
                            pattern: '+(src)+(*){/**,}',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: './*.scss',
                            group: 'sibling',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['src'],
                    'newlines-between': 'always',
                    warnOnUnassignedImports: true,
                },
            ],
        },
    }
];