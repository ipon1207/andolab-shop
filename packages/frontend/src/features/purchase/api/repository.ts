import {
    productListSchema,
    productResponseSchema,
    purchaseLogResponseSchema,
} from '@andolab-shop/shared';
import { client } from '../../../api';

export const purchaseRepository = {
    // JANコードを送って購入処理を行う
    purchase: async (janCode: string) => {
        const res = await client.api.purchase.$post({
            json: { janCode },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                (errorData as { message?: string }).message ||
                    '購入処理に失敗しました',
            );
        }
        const raw = (await res.json()) as { product: unknown };
        const parsed = productResponseSchema.safeParse(raw.product);
        if (!parsed.success) {
            throw new Error('不正なレスポンス形式です');
        }
        return parsed.data;
    },
    // 購入の取り消し処理を行う
    cancelPurchase: async () => {
        const res = await client.api.purchase.cancel.$post();
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                (errorData as { message?: string }).message ||
                    '購入キャンセルに失敗しました',
            );
        }
        const raw = (await res.json()) as { purchaseLog: unknown };
        const parsed = purchaseLogResponseSchema.safeParse(raw.purchaseLog);
        if (!parsed.success) {
            throw new Error('不正なレスポンス形式です');
        }
        return parsed.data;
    },
    // 商品マスタ全件取得
    fetchAllProducts: async () => {
        const res = await client.api.products.$get();
        if (!res.ok) throw new Error('商品一覧の取得に失敗しました');
        const data = await res.json();
        const parsed = productListSchema.safeParse(data);
        if (!parsed.success) throw new Error('不正なレスポンス形式です');
        return parsed.data;
    },
};
