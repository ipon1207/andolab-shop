import { Product, PurchaseLog } from '@andolab-shop/db-schema';
import {
    ProductResponseData,
    PurchaseLogResponseData,
} from '@andolab-shop/shared';

/**
 * DB の Product 型から API レスポンス型への変換
 */
export const toProductResponse = (product: Product): ProductResponseData => {
    return {
        productId: product.productId,
        janCode: product.janCode ?? null,
        name: product.productName,
        price: product.price,
        type: product.type,
        stock: product.stock,
    };
};

/**
 * DB の PurchaseLog 型から API レスポンス型への変換
 */
export const toPurchaseLogResponse = (
    log: PurchaseLog,
): PurchaseLogResponseData => {
    return {
        logId: log.logId,
        productId: log.productId,
        soldAt: log.soldAt,
        soldPrice: log.soldPrice,
        canceledAt: log.canceledAt,
    };
};
