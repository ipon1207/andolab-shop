import {
    ProductListResponseData,
    productListSchema,
} from '@andolab-shop/shared';
import { client } from '../../../api';

export const productRepository = {
    fetchAll: async (): Promise<ProductListResponseData> => {
        const res = await client.api.products.$get();

        if (!res.ok) throw new Error('商品一覧に失敗しました');

        const data = await res.json();
        const parsed = productListSchema.safeParse(data);
        if (!parsed.success) throw new Error('データ形式が不正です');
        return parsed.data;
    },
};
