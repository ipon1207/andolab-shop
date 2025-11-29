# API 型定義

APIで使用される型定義の一覧です。これらの型は `packages/shared/src/schema.ts` で Zod を使用して定義されています。

---

## 共通型

### ProductResponseData

商品情報のレスポンス型。購入APIおよび商品一覧APIで使用されます。

```typescript
type ProductResponseData = {
    productId: number; // 商品ID
    janCode: string | null; // JANコード（nullable）
    name: string; // 商品名
    price: number; // 販売価格
    type: string; // 商品カテゴリ
    stock: number; // 在庫数
};
```

### PurchaseLogResponseData

購入履歴のレスポンス型。購入キャンセルAPIで使用されます。

```typescript
type PurchaseLogResponseData = {
    logId: number; // 購入履歴ID
    productId: number; // 商品ID
    soldAt: Date; // 購入日時
    soldPrice: number; // 購入時価格
    canceledAt: Date | null; // キャンセル日時（nullable）
};
```

---

## リクエスト型

### PurchaseData

購入APIのリクエストボディ型。

```typescript
type PurchaseData = {
    janCode: string; // 購入する商品のJANコード
};
```

### BulkSupplyitem

仕入れデータの1行分の型。

```typescript
type BulkSupplyitem = {
    janCode: string; // JANコード（空文字可）
    productName: string; // 商品名
    price: number; // 販売価格
    type: string; // 商品カテゴリ
    quantity: number; // 仕入れ数量
};
```

### BulkSupplyRequestData

一括仕入れAPIのリクエストボディ型。

```typescript
type BulkSupplyRequestData = BulkSupplyitem[];
```

---

## レスポンス型（配列）

### ProductListResponseData

商品一覧APIのレスポンス型。`ProductResponseData` の配列です。

```typescript
type ProductListResponseData = ProductResponseData[];
```

---

## Zod スキーマ

### purchaseSchema

```typescript
const purchaseSchema = z.object({
    janCode: z.string(),
});
```

### productResponseSchema

```typescript
const productResponseSchema = z.object({
    productId: z.number(),
    janCode: z.string().nullable(),
    name: z.string(),
    price: z.number(),
    type: z.string(),
    stock: z.number(),
});
```

### purchaseLogResponseSchema

```typescript
const purchaseLogResponseSchema = z.object({
    logId: z.number(),
    productId: z.number(),
    soldAt: z.coerce.date(),
    soldPrice: z.number(),
    canceledAt: z.coerce.date().nullable(),
});
```

### bulkSupplyItemSchema

```typescript
const bulkSupplyItemSchema = z.object({
    janCode: z.string(),
    productName: z.string(),
    price: z.number(),
    type: z.string(),
    quantity: z.number(),
});
```

### bulkSupplyRequestSchema

```typescript
const bulkSupplyRequestSchema = z.array(bulkSupplyItemSchema);
```

### productListSchema

```typescript
const productListSchema = z.array(
    z.object({
        productId: z.number(),
        janCode: z.string().nullable(),
        name: z.string(),
        price: z.number(),
        type: z.string(),
        stock: z.number(),
    }),
);
```

---

## 使用方法

### フロントエンドでの型インポート

```typescript
import {
    ProductResponseData,
    PurchaseLogResponseData,
    ProductListResponseData,
    BulkSupplyitem,
    BulkSupplyRequestData,
} from '@andolab-shop/shared';
```

### バリデーション

```typescript
import { productResponseSchema } from '@andolab-shop/shared';

const result = productResponseSchema.safeParse(data);
if (result.success) {
    // result.data は ProductResponseData 型
    console.log(result.data);
} else {
    // バリデーションエラー
    console.error(result.error);
}
```
