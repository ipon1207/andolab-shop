import z from 'zod';

// 購入処理のリクエストボディの型
export const purchaseSchema = z.object({
    janCode: z.string(),
});

// 購入処理APIのレスポンス型
export const productResponseSchema = z.object({
    productId: z.number(),
    janCode: z.string(),
    productName: z.string(),
    price: z.number(),
    stock: z.number(),
});

export type PurchaseData = z.infer<typeof purchaseSchema>;
export type ProductResponseData = z.infer<typeof productResponseSchema>;
