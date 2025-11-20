import { serve } from '@hono/node-server';
import { db, products, purchaseLogs } from '@andolab-shop/db-schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { purchaseSchema, setPurchaseLogSchema } from '@andolab-shop/shared/src';

const app = new Hono();

app.use(
    '/api/*',
    cors({
        origin: ['http://localhost:8080', 'http://127.0.0.1:5173'], // DevContainer用に追加
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
    }),
);

// productsテーブルのstockを1減らし、該当商品の情報を返すAPIエンドポイント
app.post(
    '/api/purchase',
    zValidator('json', purchaseSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const data = c.req.valid('json');
        const result = await db
            .select()
            .from(products)
            .where(eq(products.janCode, data.janCode));
        if (result.length === 0) {
            return c.json({ message: '未登録の商品です' }, 404);
        }
        if (!result[0].stock || result[0].stock <= 0) {
            return c.json({ message: '在庫が不足しています' }, 400);
        }
        await db
            .update(products)
            .set({ stock: result[0].stock - 1 })
            .where(eq(products.productId, result[0].productId));
        return c.json(result);
    },
);

// productIdとpriceを受け取り、purchaseLogsテーブルに購入履歴を追加するAPIエンドポイント
app.post(
    '/api/setPurchaseLog',
    zValidator('json', setPurchaseLogSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const data = c.req.valid('json');
        const result = await db
            .insert(purchaseLogs)
            .values({
                productId: data.productId,
                soldAt: new Date(),
                soldPrice: data.price,
            })
            .returning();
        return c.json(result);
    },
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});
