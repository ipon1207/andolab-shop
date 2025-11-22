import z from 'zod';

// 購入処理のリクエストボディの型定義
export const purchaseSchema = z.object({
    janCode: z.string(),
});

// 購入履歴記録の引数の型定義
export const logSchema = z.object({
    productId: z.number(),
    price: z.number(),
});

export type PurchaseData = z.infer<typeof purchaseSchema>;
export type LogData = z.infer<typeof logSchema>;
