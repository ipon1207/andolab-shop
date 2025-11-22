import z from 'zod';

// 購入履歴処理の引数のスキーマ定義
export const LogData = z.object({
    productId: z.number(),
    price: z.number(),
});

export type LogData = z.infer<typeof LogData>;
