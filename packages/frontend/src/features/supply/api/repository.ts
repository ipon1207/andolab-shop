import {
    BulkSupplyRequestData,
    ProductListResponseData,
    productListSchema,
} from '@andolab-shop/shared';
import { client } from '../../../api';

export const supplyRepository = {
    // 商品マスタ全件取得
    fetchAllProducts: async (): Promise<ProductListResponseData> => {
        const res = await client.api.products.$get();

        if (!res.ok) throw new Error('商品一覧の取得に失敗しました');

        const data = await res.json();
        const parsed = productListSchema.safeParse(data);
        if (!parsed.success) {
            console.error(parsed.error);
            throw new Error('商品一覧のデータ形式が不正です');
        }
        return parsed.data;
    },

    // 一括仕入れ登録
    registerBulkSupply: async (
        data: BulkSupplyRequestData,
    ): Promise<{ message: string; count: number }> => {
        const res = await client.api.supply.bulk.$post({ json: data });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                (errorData as { message?: string }).message ||
                    '仕入れ登録に失敗しました',
            );
        }
        const result = await res.json();
        return result;
    },
};
