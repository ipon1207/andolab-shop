import { Hono } from 'hono';
import { productRepository } from './repository';
import { productListSchema } from '@andolab-shop/shared';

const app = new Hono();

export const productRouter = app.get('/', async (c) => {
    try {
        const allProducts = productRepository.finaAll();

        // DBの型とAPIの型を合わせる
        const response = allProducts.map((product) => ({
            productId: product.productId,
            janCode: product.janCode,
            name: product.productName,
            price: product.price,
            type: product.type,
        }));
        // 型チェック
        const parsed = productListSchema.parse(response);
        return c.json(parsed);
    } catch (e) {
        console.error(e);
        return c.json({ message: '商品一覧の取得に失敗しました' }, 500);
    }
});
