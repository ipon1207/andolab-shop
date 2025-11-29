# ディレクトリ構造

このドキュメントでは、安藤研究室購買部プロジェクトのディレクトリ構造について説明します。

---

## 概要

このプロジェクトは **npm workspaces** を使用したモノレポ構成になっています。

```
andolab-shop/
├── packages/           # 各パッケージ
│   ├── backend/        # バックエンドAPI (Hono)
│   ├── frontend/       # フロントエンド (React + Vite)
│   ├── db-schema/      # データベーススキーマ (Drizzle ORM)
│   └── shared/         # 共有型定義・バリデーション
├── documents/          # プロジェクトドキュメント
└── (設定ファイル群)
```

---

## ルートディレクトリ

```
andolab-shop/
├── .github/                # GitHub Actions ワークフロー
├── .husky/                 # Git hooks (コミット時のlint等)
├── .vscode/                # VSCode設定
├── documents/              # ドキュメント
├── node_modules/           # 依存パッケージ（自動生成）
├── packages/               # モノレポのパッケージ群
├── .gitignore              # Git除外設定
├── .prettierrc             # Prettier設定
├── commitlint.config.js    # コミットメッセージのlint設定
├── eslint.config.js        # ESLint設定
├── package.json            # ルートpackage.json（workspaces定義）
├── package-lock.json       # 依存関係ロックファイル
├── tsconfig.base.json      # TypeScript基本設定
├── tsconfig.node.json      # Node.js用TypeScript設定
└── README.md               # プロジェクト概要
```

---

## packages/backend（バックエンドAPI）

Hono フレームワークを使用したREST APIサーバーです。

```
packages/backend/
├── src/
│   ├── index.ts            # エントリーポイント（サーバー起動・ルーティング）
│   ├── core/               # コア機能
│   │   └── errors.ts       # ドメインエラー定義
│   ├── modules/            # 機能モジュール
│   │   ├── product/        # 商品モジュール
│   │   │   ├── index.ts    # ルーター定義
│   │   │   ├── service.ts  # ビジネスロジック
│   │   │   └── repository.ts # データアクセス
│   │   ├── purchase/       # 購入モジュール
│   │   │   ├── index.ts    # ルーター定義
│   │   │   ├── service.ts  # ビジネスロジック
│   │   │   ├── repository.ts # データアクセス
│   │   │   └── mapper.ts   # 型変換（DB型⇔API型）
│   │   └── supply/         # 仕入れモジュール
│   │       ├── index.ts    # ルーター定義
│   │       ├── service.ts  # ビジネスロジック
│   │       └── repository.ts # データアクセス
│   └── utils/              # ユーティリティ
│       └── discord.ts      # Discord通知
├── dist/                   # ビルド出力（自動生成）
├── package.json
└── tsconfig.json
```

### アーキテクチャ（3層構造）

各モジュールは以下の3層で構成されています：

| レイヤー   | ファイル        | 責務                                          |
| ---------- | --------------- | --------------------------------------------- |
| Router     | `index.ts`      | HTTPリクエスト/レスポンス処理、バリデーション |
| Service    | `service.ts`    | ビジネスロジック、トランザクション管理        |
| Repository | `repository.ts` | データベースアクセス                          |

---

## packages/frontend（フロントエンド）

React + Vite で構築されたSPAです。

```
packages/frontend/
├── src/
│   ├── main.tsx            # エントリーポイント
│   ├── App.tsx             # ルートコンポーネント
│   ├── api.ts              # APIクライアント設定
│   ├── index.css           # グローバルスタイル
│   ├── components/         # 共通コンポーネント
│   │   └── CatalogModal.tsx
│   ├── hooks/              # 共通カスタムフック
│   │   └── useCatalog.ts
│   └── features/           # 機能別モジュール
│       ├── product/        # 商品一覧機能
│       │   ├── api/
│       │   │   └── repository.ts
│       │   ├── components/
│       │   │   └── ProductListPage.tsx
│       │   └── hooks/
│       │       └── useProductList.ts
│       ├── purchase/       # 購入機能
│       │   ├── api/
│       │   │   └── repository.ts
│       │   ├── components/
│       │   │   └── PurchasePage.tsx
│       │   └── hooks/
│       │       ├── usePurchase.ts
│       │       └── usePurchaseForm.ts
│       └── supply/         # 仕入れ機能
│           ├── api/
│           │   └── repository.ts
│           ├── components/
│           │   └── SupplyPage.tsx
│           └── hooks/
│               └── useSupply.ts
├── public/                 # 静的ファイル
├── dist/                   # ビルド出力（自動生成）
├── index.html              # HTMLテンプレート
├── vite.config.ts          # Vite設定
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

### フロントエンドアーキテクチャ

Feature-based構成を採用しています：

```
features/{機能名}/
├── api/            # API通信（repository）
├── components/     # UIコンポーネント
└── hooks/          # カスタムフック（状態管理・ロジック）
```

---

## packages/db-schema（データベース）

Drizzle ORM を使用したデータベーススキーマ管理です。

```
packages/db-schema/
├── src/
│   ├── index.ts        # DBインスタンスのエクスポート
│   ├── schema.ts       # テーブルスキーマ定義
│   └── seed.ts         # シードデータ
├── drizzle/            # マイグレーションファイル
│   ├── 0000_*.sql      # マイグレーション #0
│   ├── 0001_*.sql      # マイグレーション #1
│   ├── ...
│   └── meta/           # マイグレーションメタデータ
│       ├── _journal.json
│       └── *.snapshot.json
├── sqlite.db           # SQLiteデータベースファイル
├── drizzle.config.ts   # Drizzle設定
├── package.json
└── tsconfig.json
```

---

## packages/shared（共有パッケージ）

フロントエンド・バックエンド間で共有する型定義とバリデーションスキーマです。

```
packages/shared/
├── src/
│   ├── index.ts        # エクスポート
│   └── schema.ts       # Zodスキーマ・型定義
├── package.json
└── tsconfig.json
```

---

## documents（ドキュメント）

プロジェクトのドキュメントです。

```
documents/
├── API/                    # APIドキュメント
│   ├── README.md           # API概要
│   ├── products.md         # 商品API
│   ├── purchase.md         # 購入API
│   ├── supply.md           # 仕入れAPI
│   └── types.md            # 型定義
├── CONTRIBUTING.md         # コントリビューションガイド
├── DATABASE_GUIDE.md       # データベースガイド
├── DEPLOYMENT.md           # デプロイメントガイド
└── DIRECTORY_STRUCTURE.md  # 本ドキュメント
```

---

## パッケージ間の依存関係

```
┌─────────────────────────────────────────────────────────────┐
│                        frontend                              │
│  (React + Vite)                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │ imports types
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        shared                                │
│  (Zod schemas + TypeScript types)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │ imports types
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        backend                               │
│  (Hono API Server)                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ imports schema + db instance
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                       db-schema                              │
│  (Drizzle ORM + SQLite)                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## ファイル命名規則

| 種類           | 規則                        | 例                    |
| -------------- | --------------------------- | --------------------- |
| コンポーネント | PascalCase                  | `ProductListPage.tsx` |
| フック         | camelCase（use接頭辞）      | `usePurchase.ts`      |
| ユーティリティ | camelCase                   | `discord.ts`          |
| 型定義         | camelCase                   | `schema.ts`           |
| 設定ファイル   | kebab-case または camelCase | `vite.config.ts`      |
