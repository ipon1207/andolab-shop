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

    // --- ★★★ ここからが今回の修正の核心 ★★★ ---

    // 1. まず、ルートにあるJS設定ファイルを正しく解析するための設定
    {
        files: ['*.js', '*.cjs'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.node.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // 2. 次に、frontendパッケージ内の「ツール設定ファイル」を解析するための特別ルール
    {
        files: [
            'packages/frontend/vite.config.ts',
            'packages/frontend/tailwind.config.js',
        ],
        languageOptions: {
            parserOptions: {
                // frontend内のNode.js用tsconfigを明示的に指定
                project: './packages/frontend/tsconfig.node.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // 3. そして、プロジェクト内の「アプリケーションコード」を解析するための一般ルール
    {
        files: ['packages/**/*.{ts,tsx}'],
        // ただし、上記で特別扱いしたファイルは除外する
        ignores: [
            'packages/frontend/vite.config.ts',
            'packages/frontend/tailwind.config.js',
        ],
        languageOptions: {
            parserOptions: {
                project: true, // project:true で、各ソースに最も近いtsconfigを探させる
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    // --- ★★★ ここまでが修正の核心 ★★★ ---

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
    eslintConfigPrettier,
);
