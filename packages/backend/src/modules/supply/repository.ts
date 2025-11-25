import { db, products, supplyLogs } from '@andolab-shop/db-schema';
import { BulkSupplyitem } from '@andolab-shop/shared';
import { sql } from 'drizzle-orm';

type DbOrTransaction =
    | typeof db
    | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSupplyRepository = (tx: DbOrTransaction) => {
    return {
        upsertProduct: (item: BulkSupplyitem) => {
            return tx
                .insert(products)
                .values({
                    janCode: item.janCode,
                    productName: item.productName,
                    price: item.price,
                    type: item.type,
                    stock: item.quantity,
                    isDeleted: false,
                })
                .onConflictDoUpdate({
                    target: products.janCode,
                    set: {
                        productName: item.productName,
                        price: item.price,
                        type: item.type,
                        stock: sql`${products.stock} + ${item.quantity}`,
                        isDeleted: false,
                    },
                })
                .returning()
                .get();
        },
        // ログ記録
        createSupplyLog: (productId: number, quantity: number) => {
            return tx
                .insert(supplyLogs)
                .values({
                    productId,
                    quantity,
                    suppliedAt: new Date(),
                })
                .run();
        },
    };
};
