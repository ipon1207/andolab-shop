import { bulkSupplyRequestSchema } from '@andolab-shop/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { supplyService } from './service';

const app = new Hono();

export const supplyRouter = app.post(
    '/bulk',
    zValidator('json', bulkSupplyRequestSchema, (result, c) => {
        if (!result.success)
            return c.json(
                { error: '不正なリクエストです', errors: result.error },
                400,
            );
    }),
    async (c) => {
        const items = c.req.valid('json');
        try {
            const results = supplyService.registerBulkSupply(items);
            return c.json({
                message: `${results.length}件の仕入れ処理が完了しました`,
                count: results.length,
            });
        } catch (e) {
            console.error(e);
            return c.json({ message: '仕入れ処理に失敗しました' }, 500);
        }
    },
);
