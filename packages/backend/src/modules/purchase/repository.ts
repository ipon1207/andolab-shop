import { db, Product, products, purchaseLogs } from '@andolab-shop/db-schema';
import { eq, sql } from 'drizzle-orm';

type DbOrTransaction =
    | typeof db
    | Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface PurchaseRepository {
    findProductByJanCode(janCode: string): Product | undefined;
    decreaseStock(productId: number): void;
    createPurchaseLog(data: { productId: number; price: number }): void;
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
        // 在庫を減らす
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
    };
};
