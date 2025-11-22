import { productResponseSchema } from '@andolab-shop/shared';
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
};
