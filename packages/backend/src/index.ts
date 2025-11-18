import { serve } from '@hono/node-server';
import { db, products } from '@andolab-shop/db-schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

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
    // console.log('Fetched products:', allProducts);
    return c.json(allProducts);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});
