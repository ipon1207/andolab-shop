import { Hono } from 'hono';
import { productListSchema } from '@andolab-shop/shared';
import { productService } from './service';

const app = new Hono();

export const productRouter = app.get('/', async (c) => {
    try {
        const products = productService.findAll();
        // 型チェック
        const parsed = productListSchema.parse(products);
        return c.json(parsed);
    } catch (e) {
        console.error(e);
        return c.json({ message: '商品一覧の取得に失敗しました' }, 500);
    }
});
