# 仕入れAPI

商品の仕入れ（在庫補充・新規商品登録）に関するAPIです。

---

## 一括仕入れ登録

複数の商品を一括で仕入れ登録します。既存商品の場合は在庫を加算し、新規商品の場合は商品マスタに登録します。

### エンドポイント

```
POST /api/supply/bulk
```

### リクエスト

#### ヘッダー

```
Content-Type: application/json
```

#### ボディ

```json
[
    {
        "janCode": "4901234567890",
        "productName": "コーラ 500ml",
        "price": 150,
        "type": "飲み物（ペットボトル）",
        "quantity": 10
    },
    {
        "janCode": "",
        "productName": "手作りクッキー",
        "price": 100,
        "type": "お菓子",
        "quantity": 5
    }
]
```

#### リクエストフィールド

| フィールド    | 型     | 必須 | 説明                                                        |
| ------------- | ------ | ---- | ----------------------------------------------------------- |
| `janCode`     | string | ✓    | JANコード。空文字の場合はインストアコードが自動生成されます |
| `productName` | string | ✓    | 商品名                                                      |
| `price`       | number | ✓    | 販売価格（円）                                              |
| `type`        | string | ✓    | 商品カテゴリ                                                |
| `quantity`    | number | ✓    | 仕入れ数量                                                  |

### レスポンス

#### 成功時 (200 OK)

```json
{
    "message": "3件の仕入れ処理が完了しました",
    "count": 3
}
```

| フィールド | 型     | 説明               |
| ---------- | ------ | ------------------ |
| `message`  | string | 処理結果メッセージ |
| `count`    | number | 処理された商品数   |

#### エラー時

| ステータス | 説明                   | レスポンス                                             |
| ---------- | ---------------------- | ------------------------------------------------------ |
| 400        | リクエストデータが不正 | `{ "error": "不正なリクエストです", "errors": {...} }` |
| 500        | サーバーエラー         | `{ "message": "仕入れ処理に失敗しました" }`            |

### 処理内容

1. **既存商品の場合（JANコードが一致）**:
    - 在庫数を `quantity` 分加算
    - 商品名、価格、カテゴリを更新
    - 削除フラグをリセット（`isDeleted: false`）

2. **新規商品の場合**:
    - 商品マスタに新規登録
    - 在庫数は `quantity` で初期化

3. **JANコードが空の場合**:
    - インストアコードを自動生成（形式: `INSTORE-{timestamp}-{random}`）
    - 例: `INSTORE-LK5J2M1-ABC`

4. **仕入れ履歴**:
    - すべての仕入れは `supply_logs` テーブルに記録

### 使用例

#### cURL

```bash
curl -X POST http://localhost:3000/api/supply/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "janCode": "4901234567890",
      "productName": "コーラ 500ml",
      "price": 150,
      "type": "飲み物（ペットボトル）",
      "quantity": 10
    }
  ]'
```

#### JavaScript (fetch)

```javascript
const items = [
    {
        janCode: '4901234567890',
        productName: 'コーラ 500ml',
        price: 150,
        type: '飲み物（ペットボトル）',
        quantity: 10,
    },
    {
        janCode: '',
        productName: '手作りクッキー',
        price: 100,
        type: 'お菓子',
        quantity: 5,
    },
];

const response = await fetch('http://localhost:3000/api/supply/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
});
const result = await response.json();
console.log(result.message);
```

### 備考

- トランザクション処理により、一部の商品で失敗した場合は全体がロールバックされます
- 同一JANコードの商品が複数回含まれている場合、順番に処理されます
