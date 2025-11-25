import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { purchaseRouter } from './modules/purchase';
import { supplyRouter } from './modules/supply';
import { productRouter } from './modules/product';

const app = new Hono();

app.use(
    '/api/*',
    cors({
        origin: [
            'http://localhost:8080',
            'http://127.0.0.1:5173', // DevContainer用に追加
            'http://localhost:5173',
        ],
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
    }),
);

export const routes = app
    .route('/api/purchase', purchaseRouter)
    .route('/api/products', productRouter)
    .route('/api/supply', supplyRouter);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});

export type AppType = typeof routes;
