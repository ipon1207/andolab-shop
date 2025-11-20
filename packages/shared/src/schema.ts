import z from 'zod';

// /api/purchaseに送るオブジェクトのスキーマ定義
export const purchaseSchema = z.object({
    janCode: z.string(),
});

// /api/setPurchaseLogに送るオブジェクトのスキーマ定義
export const setPurchaseLogSchema = z.object({
    productId: z.number(),
    price: z.number(),
});

export type JanCode = z.infer<typeof purchaseSchema>;
export type SetPurchaseLog = z.infer<typeof setPurchaseLogSchema>;
