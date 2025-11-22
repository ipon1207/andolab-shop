import { serve } from '@hono/node-server';
import { db, products, purchaseLogs } from '@andolab-shop/db-schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { eq, sql } from 'drizzle-orm';
import { purchaseSchema } from '@andolab-shop/shared/src';

const app = new Hono();

app.use(
    '/api/*',
    cors({
        origin: ['http://localhost:8080', 'http://127.0.0.1:5173'], // DevContainer用に追加
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
    }),
);

// productsテーブルのstockを1減らし、purchaseLogsテーブルに購入履歴を挿入するAPIエンドポイント
app.post(
    '/api/purchase',
    zValidator('json', purchaseSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const data = c.req.valid('json');

        try {
            const result = await db.transaction(async (tx) => {
                // janCodeから商品を検索
                const targetProduct = await tx
                    .select()
                    .from(products)
                    .where(eq(products.janCode, data.janCode));
                // 商品が存在しない or 在庫がない場合の処理
                if (targetProduct.length === 0 || targetProduct[0].stock <= 0) {
                    throw new Error('NOT_FOUND_OR_NO_STOCK');
                }
                // 在庫を減らす
                await tx
                    .update(products)
                    .set({ stock: sql`${products.stock} - 1` })
                    .where(eq(products.productId, targetProduct[0].productId));
                // purchaseLogsテーブルに購入履歴を挿入
                await tx.insert(purchaseLogs).values({
                    productId: targetProduct[0].productId,
                    soldAt: new Date(),
                    soldPrice: targetProduct[0].price,
                });
                return targetProduct;
            });
            return c.json(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e.message);
            }
            return c.json({ message: '購入処理に失敗しました' }, 400);
        }
    },
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});
