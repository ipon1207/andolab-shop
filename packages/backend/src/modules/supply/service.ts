import { db } from '@andolab-shop/db-schema';
import { BulkSupplyRequestData } from '@andolab-shop/shared';
import { createSupplyRepository } from './repository';

export const supplyService = {
    registerBulkSupply: (items: BulkSupplyRequestData) => {
        return db.transaction((tx) => {
            const repo = createSupplyRepository(tx);
            const results = items.map((item) => {
                const product = repo.upsertProduct(item);
                repo.createSupplyLog(product.productId, item.quantity);
                return product;
            });
            return results;
        });
    },
};
