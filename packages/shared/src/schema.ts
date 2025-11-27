import z from 'zod';

// 購入処理のリクエストボディの型
export const purchaseSchema = z.object({
    janCode: z.string(),
});

// 購入処理APIのレスポンス型
export const productResponseSchema = z.object({
    productId: z.number(),
    janCode: z.string().nullable(),
    name: z.string(),
    price: z.number(),
    type: z.string(),
    stock: z.number(),
});

// 購入キャンセルAPIのレスポンス型
export const purchaseLogResponseSchema = z.object({
    logId: z.number(),
    productId: z.number(),
    soldAt: z.coerce.date(),
    soldPrice: z.number(),
    canceledAt: z.coerce.date().nullable(),
});

// 一括仕入れデータの1行分のデータ型
export const bulkSupplyItemSchema = z.object({
    janCode: z.string(),
    productName: z.string(),
    price: z.number(),
    type: z.string(),
    quantity: z.number(),
});

// 仕入れAPIに送るリクエストボディの型
export const bulkSupplyRequestSchema = z.array(bulkSupplyItemSchema);

// 商品一覧取得のレスポンス型（全件取得）
export const productListSchema = z.array(
    z.object({
        productId: z.number(),
        janCode: z.string().nullable(),
        name: z.string(),
        price: z.number(),
        type: z.string(),
        stock: z.number(),
    }),
);

export type PurchaseData = z.infer<typeof purchaseSchema>;
export type ProductResponseData = z.infer<typeof productResponseSchema>;
export type PurchaseLogResponseData = z.infer<typeof purchaseLogResponseSchema>;
export type BulkSupplyitem = z.infer<typeof bulkSupplyItemSchema>;
export type BulkSupplyRequestData = z.infer<typeof bulkSupplyRequestSchema>;
export type ProductListResponseData = z.infer<typeof productListSchema>;
