import { serve } from '@hono/node-server';
import { db, insertProductSchema, products } from '@andolab-shop/db-schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';

const app = new Hono();

app.use(
    '/api/*',
    cors({
        origin: ['http://localhost:8080', 'http://127.0.0.1:5173'], // DevContainer用に追加
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
    }),
);

// GET /products: 全商品を取得するAPI
app.get('/api/products', async (c) => {
    const allProducts = await db.select().from(products).all();
    return c.json(allProducts);
});

// POSt /products: 新しい商品を追加するAPI
app.post(
    '/api/products',
    zValidator('json', insertProductSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const data = c.req.valid('json');
        const result = await db.insert(products).values(data).returning();
        return c.json(result);
    },
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});
