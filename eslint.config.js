// @ts-check

import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    // --- グローバルな設定 ---
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            'packages/frontend/public/**',
        ],
    },

    // --- すべてのファイルに適用される基本設定 ---
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
    },

    // --- JavaScript/TypeScript共通の推奨設定 ---
    ...tseslint.configs.recommended,

    // --- React関連の設定 ---
    {
        files: ['packages/frontend/src/**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // --- Prettierとの競合を避けるための設定 ---
    // 必ず配列の最後に記述してください
    eslintConfigPrettier,
);
