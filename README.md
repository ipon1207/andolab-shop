# Andolab Shop

Raspberry Pi上で動作する、安藤研究室購買システム

---

## 📚 目次

- [✨ プロジェクト概要](#-プロジェクト概要)
- [🛠️ 技術スタック](#️-技術スタック)
- [📂 ディレクトリ構成](#-ディレクトリ構成)
- [🚀 セットアップと起動方法](#-セットアップと起動方法)
- [📜 利用可能なスクリプト](#-利用可能なスクリプト)
- [✍️ 開発の進め方とルール](#️-開発の進め方とルール)

---

## ✨ プロジェクト概要

このプロジェクトは、Andolabのメンバーが技術学習と実用を兼ねて開発している、Raspberry Pi上で動作するアプリケーションです。購買システムとして、研究室内での物品管理や販売を効率化することを目的としています。

主な機能として、以下のものを計画しています。

- <機能1 例: 商品の閲覧機能>
- <機能2 例: 在庫管理機能>
- <機能3 例: ...>

## 🛠️ 技術スタック

このプロジェクトは、以下の技術スタックで構成されています。

| カテゴリ           | 技術                                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **モノレポ管理**   | [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)                                                                                |
| **フロントエンド** | [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **バックエンド**   | [Hono](https://hono.dev/), [TypeScript](https://www.typescriptlang.org/)                                                                            |
| **データベース**   | [SQLite](https://www.sqlite.org/index.html)                                                                                                         |
| **ORM**            | [Drizzle ORM](https://orm.drizzle.team/)                                                                                                            |
| **スキーマ定義**   | [Zod](https://zod.dev/)                                                                                                                             |
| **コード品質**     | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)                                                                                     |
| **実行環境**       | [Node.js](https://nodejs.org/), Raspberry Pi 4 Model B                                                                                              |

## 📂 ディレクトリ構成

このプロジェクトは npm Workspaces を利用したモノレポ構成です。主要なディレクトリは以下の通りです。

```
.
├── packages/
│   ├── frontend/   # React (Vite) で構築されたフロントエンドアプリケーション
│   ├── backend/    # Hono で構築されたバックエンドAPIサーバー
│   ├── db-schema/  # Drizzle ORM のスキーマ定義とマイグレーションファイル
│   └── shared/     # フロントエンドとバックエンドで共有される型定義など (現在は未使用)
└── ...
```

## 🚀 セットアップと起動方法

このプロジェクトをローカル環境で動かすための手順です。

### 1. 前提条件

- [Node.js](https://nodejs.org/) (v20.x 以上を推奨)
- [Git](https://git-scm.com/)

### 2. セットアップ手順

1.  **リポジトリをクローンします**

    ```bash
    git clone <リポジトリのURL>
    cd <リポジトリ名>
    ```

2.  **依存パッケージをインストールします**
    プロジェクトのルートディレクトリで以下のコマンドを実行すると、すべてのパッケージ（フロントエンド、バックエンド等）の依存関係が一度にインストールされます。

    ```bash
    npm install
    ```

3.  **（初回のみ）データベースを準備します**
    スキーマ定義を元に、SQLiteのデータベースファイルとテーブルを作成します。

    ```bash
    npm run db:migrate
    ```

    成功すると、`packages/db-schema/`ディレクトリに`sqlite.db`ファイルが作成されます。

4.  **開発サーバーを起動します**
    フロントエンドとバックエンドの開発サーバーを同時に起動します。

    ```bash
    npm run dev
    ```

5.  **ブラウザで確認**
    - フロントエンド: `http://localhost:5173` (Viteのデフォルト)
    - バックエンドAPI: `http://localhost:3000`

    にアクセスして、アプリケーションが表示されればセットアップ完了です！

## 📜 利用可能なスクリプト

プロジェクトのルートディレクトリで、以下のnpmスクリプトが利用できます。

- `npm run dev`
    - フロントエンドとバックエンドの開発サーバーを同時に起動します。

- `npm run dev:frontend` / `npm run dev:backend`
    - それぞれのサーバーを個別に起動します。

- `npm run db:generate`
    - `packages/db-schema/src` 内のスキーマ定義ファイルの変更を元に、新しいマイグレーションファイルを生成します。

- `npm run db:migrate`
    - 未適用のマイグレーションファイルを実行し、データベースのスキーマを更新します。

- `npm run lint`
    - プロジェクト全体のコードに対して、ESLintによる静的解析を実行します。

- `npm run format`
    - プロジェクト全体のコードを、Prettierを使って自動整形します。

## ✍️ 開発の進め方とルール

このプロジェクトでの開発の進め方、ブランチ戦略、Pull Requestのルールなどは、以下のドキュメントにまとめています。
開発を始める前に、必ず一度目を通してください。

**[ CONTRIBUTING.md ](./CONTRIBUTING.md)**

---
