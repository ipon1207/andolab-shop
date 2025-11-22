import { productResponseSchema, purchaseSchema } from '@andolab-shop/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { purchaseService } from './service';
import { DomainError } from '../../core/errors';

const app = new Hono();

export const purchaseRouter = app.post(
    '/',
    zValidator('json', purchaseSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: 'Invalid data', errors: result.error }, 400);
        }
    }),
    async (c) => {
        const { janCode } = c.req.valid('json');
        try {
            const product = purchaseService.purchase(janCode);
            const parsed = productResponseSchema.parse(product);
            return c.json({ product: parsed });
        } catch (e) {
            if (e instanceof DomainError) {
                switch (e.code) {
                    case 'NOT_FOUND':
                        return c.json({ message: '商品が見つかりません' }, 404);
                    case 'NO_STOCK':
                        return c.json({ message: '在庫が不足しています' }, 409);
                }
            }
            return c.json({ message: '購入処理に失敗しました' }, 500);
        }
    },
);
