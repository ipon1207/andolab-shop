import {
    ProductResponseData,
    productResponseSchema,
    PurchaseLogResponseData,
    purchaseLogResponseSchema,
    purchaseSchema,
} from '@andolab-shop/shared';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { purchaseService } from './service';
import {
    DomainError,
    NotFoundCancelablePurchaseError,
} from '../../core/errors';
import { Product, PurchaseLog } from '@andolab-shop/db-schema';

const app = new Hono();

const toProductResponse = (product: Product): ProductResponseData => {
    return {
        productId: product.productId,
        janCode: product.janCode,
        name: product.productName,
        price: product.price,
        type: product.type,
        stock: product.stock,
    };
};

const toPurchaseLogResponse = (log: PurchaseLog): PurchaseLogResponseData => {
    return {
        logId: log.logId,
        productId: log.productId,
        soldAt: log.soldAt,
        soldPrice: log.soldPrice,
        canceledAt: log.canceledAt,
    };
};

export const purchaseRouter = app
    .post(
        '/',
        zValidator('json', purchaseSchema, (result, c) => {
            if (!result.success) {
                return c.json(
                    {
                        error: '不正なリクエストデータです',
                        errors: result.error,
                    },
                    400,
                );
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
                            return c.json(
                                { message: '商品が見つかりません' },
                                404,
                            );
                        case 'NO_STOCK':
                            return c.json(
                                { message: '在庫が不足しています' },
                                409,
                            );
                    }
                }
                return c.json({ message: '購入処理に失敗しました' }, 500);
            }
        },
    )
    .post('/cancel', async (c) => {
        try {
            const purchaseLog = purchaseService.cancelPurchase();
            const response = toPurchaseLogResponse(purchaseLog);
            const parsed = purchaseLogResponseSchema.parse(response);
            return c.json({
                message: '購入を取り消しました',
                purchaseLog: parsed,
            });
        } catch (e) {
            if (e instanceof NotFoundCancelablePurchaseError) {
                return c.json(
                    { message: 'キャンセル可能な購入履歴が見つかりません' },
                    404,
                );
            }
            return c.json({ message: '購入キャンセル処理に失敗しました' }, 500);
        }
    });
