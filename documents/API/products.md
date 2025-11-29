# 商品API

商品情報の取得に関するAPIです。

---

## 商品一覧取得

販売中の全商品を取得します。

### エンドポイント

```
GET /api/products
```

### リクエスト

パラメータなし

### レスポンス

#### 成功時 (200 OK)

```json
[
    {
        "productId": 1,
        "janCode": "4901234567890",
        "name": "コーラ 500ml",
        "price": 150,
        "type": "飲み物（ペットボトル）",
        "stock": 10
    },
    {
        "productId": 2,
        "janCode": "4901234567891",
        "name": "ポテトチップス",
        "price": 120,
        "type": "お菓子",
        "stock": 5
    }
]
```

#### レスポンスフィールド

| フィールド  | 型             | 説明                                                    |
| ----------- | -------------- | ------------------------------------------------------- |
| `productId` | number         | 商品ID（主キー）                                        |
| `janCode`   | string \| null | JANコード（バーコード番号）。インストア商品の場合はnull |
| `name`      | string         | 商品名                                                  |
| `price`     | number         | 販売価格（円）                                          |
| `type`      | string         | 商品カテゴリ                                            |
| `stock`     | number         | 在庫数                                                  |

#### 商品カテゴリ (`type`) の値

- `お菓子`
- `飲み物（ペットボトル）`
- `飲み物（缶）`
- `軽食`
- `アイス`
- `その他`

#### エラー時 (500 Internal Server Error)

```json
{
    "message": "商品一覧の取得に失敗しました"
}
```

### 使用例

#### cURL

```bash
curl -X GET http://localhost:3000/api/products
```

#### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/products');
const products = await response.json();
console.log(products);
```

### 備考

- 削除済み（`isDeleted: true`）の商品は返却されません
- 在庫が0の商品も一覧に含まれます
