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

export type PurchaseData = z.infer<typeof purchaseSchema>;
export type ProductResponseData = z.infer<typeof productResponseSchema>;
export type PurchaseLogResponseData = z.infer<typeof purchaseLogResponseSchema>;
