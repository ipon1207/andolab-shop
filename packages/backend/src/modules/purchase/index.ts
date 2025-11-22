import {
    ProductResponseData,
    productResponseSchema,
    purchaseSchema,
} from '@andolab-shop/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { purchaseService } from './service';
import { DomainError } from '../../core/errors';
import { Product } from '@andolab-shop/db-schema';

const app = new Hono();

const toProductResponse = (product: Product): ProductResponseData => {
    return {
        productId: product.productId,
        janCode: product.janCode,
        name: product.productName,
        price: product.price,
        stock: product.stock,
    };
};

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
            const response = toProductResponse(product);
            const parsed = productResponseSchema.parse(response);
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
