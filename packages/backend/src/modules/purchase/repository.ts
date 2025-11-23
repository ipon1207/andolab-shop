import {
    db,
    Product,
    products,
    PurchaseLog,
    purchaseLogs,
} from '@andolab-shop/db-schema';
import { desc, eq, isNull, sql } from 'drizzle-orm';

type DbOrTransaction =
    | typeof db
    | Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface PurchaseRepository {
    findProductByJanCode(janCode: string): Product | undefined;
    decreaseStock(productId: number): void;
    createPurchaseLog(data: { productId: number; price: number }): void;
    findLatestPurchaseLog(): PurchaseLog | undefined;
    markAsCanceled(logId: number): void;
    increaseStock(productId: number): void;
}

export const createPurchaseRepository = (
    tx: DbOrTransaction,
): PurchaseRepository => {
    return {
        // 商品をJANコードで検索
        findProductByJanCode: (janCode: string) => {
            return tx
                .select()
                .from(products)
                .where(eq(products.janCode, janCode))
                .get();
        },
        // 在庫を1減らす
        decreaseStock: (productId: number) => {
            return tx
                .update(products)
                .set({ stock: sql`${products.stock} - 1` })
                .where(eq(products.productId, productId))
                .run();
        },
        // 購入履歴を記録
        createPurchaseLog: ({ productId, price }) => {
            return tx
                .insert(purchaseLogs)
                .values({
                    productId,
                    soldAt: new Date(),
                    soldPrice: price,
                })
                .run();
        },
        // 最新の購入履歴を取得
        findLatestPurchaseLog: () => {
            return tx
                .select()
                .from(purchaseLogs)
                .where(isNull(purchaseLogs.canceledAt))
                .orderBy(desc(purchaseLogs.logId))
                .limit(1)
                .get();
        },
        // 購入履歴を論理削除
        markAsCanceled: (logId: number) => {
            return tx
                .update(purchaseLogs)
                .set({ canceledAt: new Date() })
                .where(eq(purchaseLogs.logId, logId))
                .run();
        },
        // 在庫を1増やす
        increaseStock: (productId: number) => {
            return tx
                .update(products)
                .set({ stock: sql`${products.stock} + 1` })
                .where(eq(products.productId, productId))
                .run();
        },
    };
};
