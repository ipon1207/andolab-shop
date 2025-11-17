<div align="center">
  <img src="<ここにプロジェクトのロゴ画像などを置くと格好良いです>" alt="プロジェクトロゴ" width="150">
  <h1>Andolab Shop - 安藤研究室 購買システム</h1>
  <p>Raspberry Pi上で動作する、研究室の物品管理・販売を効率化するためのアプリケーションです。</p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-v20.x-339933?logo=nodedotjs" alt="Node.js version">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React version">
    <img src="https://img.shields.io/badge/Hono-v4-E65225?logo=hono" alt="Hono version">
    <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite" alt="SQLite version">
    <img src="https://img.shields.io/badge/code%20style-Prettier-ff69b4.svg" alt="Code style: Prettier">
  </p>
</div>

---

## 📚 目次

- [✨ 概要](#-概要)
- [🎯 主な機能](#-主な機能)
- [🛠️ 技術スタック](#️-技術スタック)
- [🚀 導入と開発](#-導入と開発)
- [📜 npmスクリプト一覧](#-npmスクリプト一覧)
- [🚢 本番環境へのデプロイ](#-本番環境へのデプロイ)
- [🤝 開発への貢献](#-開発への貢献)

---

## ✨ 概要

**Andolab Shop**は、安藤研究室のメンバーが技術学習と実用を兼ねて開発している、Raspberry Pi上で動作する購買システムです。研究室内での物品管理や販売を効率化し、より快適な研究生活をサポートすることを目的としています。

このプロジェクトはnpm Workspacesを利用したモノレポ構成を採用しており、フロントエンドとバックエンドのコードが一つのリポジトリで管理されています。

## 🎯 主な機能

- [ ] 商品の閲覧・検索機能
- [ ] 商品の購入機能
- [ ] 在庫管理機能（管理者向け）
- [ ] 購入履歴の確認機能

## 🛠️ 技術スタック

| カテゴリ           | 技術                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **モノレポ管理**   | [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)                                                                              |
| **フロントエンド** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **バックエンド**   | [Hono](https://hono.dev/), [TypeScript](https://www.typescriptlang.org/)                                                                          |
| **データベース**   | [SQLite](https://www.sqlite.org/index.html)                                                                                                       |
| **ORM**            | [Drizzle ORM](https://orm.drizzle.team/)                                                                                                          |
| **コード品質**     | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)                                                                                   |
| **実行環境**       | [Node.js](https://nodejs.org/), Raspberry Pi 4 Model B                                                                                            |

---

## 🚀 導入と開発

このプロジェクトをローカル環境でセットアップし、開発を始めるための手順です。

### 1. 前提条件

- [Node.js](https://nodejs.org/) (v20.x 以上を推奨)
- [Git](https://git-scm.com/)

### 2. 初回セットアップ

1.  **リポジトリをクローンします。**

    ```bash
    git clone <リポジトリのURL>
    cd andolab-shop
    ```

2.  **依存パッケージを一括インストールします。**

    ```bash
    npm install
    ```

3.  **データベースを準備します。**
    スキーマ定義を元に、SQLiteのデータベースファイルとテーブルを作成します。
    ```bash
    npm run db:migrate
    ```
    成功すると `packages/db-schema/sqlite.db` が生成されます。

### 3. 日常の開発

1.  **開発サーバーを起動します。**
    フロントエンドとバックエンドのサーバーが同時に起動し、コードの変更が自動で反映されます。

    ```bash
    npm run dev
    ```

2.  **ブラウザでアクセスします。**
    - **フロントエンド:** `http://localhost:5173`
    - **バックエンド API:** `http://localhost:3000`

---

## 📜 npmスクリプト一覧

プロジェクトのルートディレクトリで、以下のnpmスクリプトが利用できます。

| スクリプト             | 説明                                                                 |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | フロントエンドとバックエンドの開発サーバーを同時に起動します。       |
| `npm run dev:frontend` | フロントエンドの開発サーバーのみを起動します。                       |
| `npm run dev:backend`  | バックエンドの開発サーバーのみを起動します。                         |
| `npm run build`        | 全パッケージを本番環境用にビルドします。                             |
| `npm run start`        | **本番用:** ビルド済みのバックエンドサーバーを起動します。           |
| `npm run db:generate`  | スキーマ定義の変更から、新しいマイグレーションファイルを生成します。 |
| `npm run db:migrate`   | 未適用のマイグレーションを実行し、データベースを更新します。         |
| `npm run lint`         | ESLintでコードの静的解析を実行します。                               |
| `npm run format`       | Prettierでコードを自動整形します。                                   |

---

## 🚢 本番環境へのデプロイ

このアプリケーションをRaspberry Pi上で永続化させ、OS起動時に自動でサーバーを起動させるための手順は、以下のドキュメントにまとめています。

**[ DEPLOYMENT.md ](./documents/DEPLOYMENT.md)**

---

## 🤝 開発への貢献

このプロジェクトでの開発の進め方、ブランチ戦略、Pull Requestのルールなどは、以下のドキュメントにまとめています。開発を始める前に、必ず一度目を通してください。

**[ CONTRIBUTING.md ](./CONTRIBUTING.md)**
