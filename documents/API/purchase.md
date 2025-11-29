# 購入API

商品の購入処理および購入キャンセルに関するAPIです。

---

## 購入処理

JANコードを指定して商品を購入します。在庫を1減らし、購入履歴を記録します。

### エンドポイント

```
POST /api/purchase
```

### リクエスト

#### ヘッダー

```
Content-Type: application/json
```

#### ボディ

```json
{
    "janCode": "4901234567890"
}
```

| フィールド | 型     | 必須 | 説明                    |
| ---------- | ------ | ---- | ----------------------- |
| `janCode`  | string | ✓    | 購入する商品のJANコード |

### レスポンス

#### 成功時 (200 OK)

```json
{
    "product": {
        "productId": 1,
        "janCode": "4901234567890",
        "name": "コーラ 500ml",
        "price": 150,
        "type": "飲み物（ペットボトル）",
        "stock": 9
    }
}
```

> **Note**: `stock` は購入後の在庫数を返します。

#### エラー時

| ステータス | 説明                   | レスポンス                                                   |
| ---------- | ---------------------- | ------------------------------------------------------------ |
| 400        | リクエストデータが不正 | `{ "error": "不正なリクエストデータです", "errors": {...} }` |
| 404        | 商品が見つからない     | `{ "message": "商品が見つかりません" }`                      |
| 409        | 在庫不足               | `{ "message": "在庫が不足しています" }`                      |
| 500        | サーバーエラー         | `{ "message": "購入処理に失敗しました" }`                    |

### 副作用

- **在庫更新**: 該当商品の在庫が1減ります
- **購入履歴記録**: `purchase_logs` テーブルに購入記録が追加されます
- **Discord通知**: 以下の条件でDiscordに通知が送信されます
    - 在庫が0になった場合: 「在庫切れ」通知
    - 在庫が5になった場合: 「在庫わずか」通知

### 使用例

#### cURL

```bash
curl -X POST http://localhost:3000/api/purchase \
  -H "Content-Type: application/json" \
  -d '{"janCode": "4901234567890"}'
```

#### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ janCode: '4901234567890' }),
});
const result = await response.json();
console.log(result.product);
```

---

## 購入キャンセル

最新の購入を取り消します。在庫を1戻し、購入履歴をキャンセル済みとしてマークします。

### エンドポイント

```
POST /api/purchase/cancel
```

### リクエスト

パラメータなし

### レスポンス

#### 成功時 (200 OK)

```json
{
    "message": "購入を取り消しました",
    "purchaseLog": {
        "logId": 42,
        "productId": 1,
        "soldAt": "2025-11-29T10:30:00.000Z",
        "soldPrice": 150,
        "canceledAt": "2025-11-29T10:35:00.000Z"
    }
}
```

#### レスポンスフィールド（purchaseLog）

| フィールド   | 型              | 説明           |
| ------------ | --------------- | -------------- |
| `logId`      | number          | 購入履歴ID     |
| `productId`  | number          | 商品ID         |
| `soldAt`     | Date (ISO 8601) | 購入日時       |
| `soldPrice`  | number          | 購入時価格     |
| `canceledAt` | Date (ISO 8601) | キャンセル日時 |

#### エラー時

| ステータス | 説明                           | レスポンス                                                  |
| ---------- | ------------------------------ | ----------------------------------------------------------- |
| 404        | キャンセル可能な購入履歴がない | `{ "message": "キャンセル可能な購入履歴が見つかりません" }` |
| 500        | サーバーエラー                 | `{ "message": "購入キャンセル処理に失敗しました" }`         |

### 副作用

- **在庫更新**: 該当商品の在庫が1増えます
- **購入履歴更新**: 最新の購入履歴に `canceledAt` が設定されます

### 使用例

#### cURL

```bash
curl -X POST http://localhost:3000/api/purchase/cancel
```

#### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/purchase/cancel', {
    method: 'POST',
});
const result = await response.json();
console.log(result.message);
```

### 備考

- キャンセル対象は「まだキャンセルされていない最新の購入履歴」です
- すでにキャンセル済みの履歴は対象外となります
