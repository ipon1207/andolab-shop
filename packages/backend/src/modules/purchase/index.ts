import { purchaseSchema } from '@andolab-shop/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { purchaseService } from './service';

const app = new Hono();

export const purchaseRouter = app.post(
    '/',
    zValidator('json', purchaseSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const data = c.req.valid('json');

        try {
            const result = purchaseService.purchase(data.janCode);
            return c.json(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                if (e.message === 'NOT_FOUND_OR_NO_STOCK') {
                    return c.json(
                        { message: '商品が見つからないか、在庫切れです' },
                        400,
                    );
                }
                console.log(e.message);
            }
            return c.json({ message: '購入処理に失敗しました' }, 500);
        }
    },
);
