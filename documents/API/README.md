# API ドキュメント

このディレクトリには、安藤研究室購買部バックエンドAPIのドキュメントが含まれています。

## 概要

バックエンドAPIは [Hono](https://hono.dev/) フレームワークを使用して構築されており、ポート `3000` で動作します。

## ベースURL

```
http://localhost:3000/api
```

## APIエンドポイント一覧

| メソッド | エンドポイント         | 説明           | ドキュメント                 |
| -------- | ---------------------- | -------------- | ---------------------------- |
| GET      | `/api/products`        | 商品一覧取得   | [products.md](./products.md) |
| POST     | `/api/purchase`        | 購入処理       | [purchase.md](./purchase.md) |
| POST     | `/api/purchase/cancel` | 購入キャンセル | [purchase.md](./purchase.md) |
| POST     | `/api/supply/bulk`     | 一括仕入れ登録 | [supply.md](./supply.md)     |

## 共通仕様

### リクエストヘッダー

```
Content-Type: application/json
```

### CORS設定

以下のオリジンからのアクセスが許可されています：

- `http://localhost:8080`
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://192.168.20.60:8080`

### エラーレスポンス形式

すべてのAPIは、エラー発生時に以下の形式でレスポンスを返します：

```json
{
    "message": "エラーメッセージ"
}
```

バリデーションエラーの場合は、追加で詳細情報が含まれます：

```json
{
    "error": "不正なリクエストデータです",
    "errors": {
        /* Zodバリデーションエラーの詳細 */
    }
}
```

## 型定義

共通の型定義は `packages/shared/src/schema.ts` で管理されています。
詳細は [types.md](./types.md) を参照してください。
