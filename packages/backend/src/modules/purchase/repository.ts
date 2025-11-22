import { db, products, purchaseLogs } from '@andolab-shop/db-schema';
import { LogData } from '@andolab-shop/shared';
import { eq, sql } from 'drizzle-orm';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbOrTx = typeof db | Tx;

export const purchaseRepository = {
    // 商品をJANコードで検索
    findProductByJanCode: (janCode: string, tx: DbOrTx = db) => {
        return tx
            .select()
            .from(products)
            .where(eq(products.janCode, janCode))
            .get();
    },
    // 在庫を減らす
    decreaseStock: (productId: number, tx: DbOrTx) => {
        return tx
            .update(products)
            .set({ stock: sql`${products.stock} - 1` })
            .where(eq(products.productId, productId))
            .run();
    },
    // 購入履歴を記録
    createPurchaseLog: (logData: LogData, tx: DbOrTx) => {
        return tx
            .insert(purchaseLogs)
            .values({
                productId: logData.productId,
                soldAt: new Date(),
                soldPrice: logData.price,
            })
            .run();
    },
};
