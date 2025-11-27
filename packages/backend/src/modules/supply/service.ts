import { db } from '@andolab-shop/db-schema';
import { BulkSupplyRequestData } from '@andolab-shop/shared';
import { createSupplyRepository } from './repository';

// インストアコードを生成するヘルパー関数
const generateInStoreCode = () => {
    const timestampe = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `INSTORE-${timestampe}-${random}`.toUpperCase();
};

export const supplyService = {
    registerBulkSupply: (items: BulkSupplyRequestData) => {
        return db.transaction((tx) => {
            const repo = createSupplyRepository(tx);
            const results = items.map((item) => {
                // JANコードが空なら、インストアコードを発行して上書きする
                const itemToSave = {
                    ...item,
                    janCode: item.janCode || generateInStoreCode(),
                };
                const product = repo.upsertProduct(itemToSave);
                repo.createSupplyLog(product.productId, item.quantity);
                return product;
            });
            return results;
        });
    },
};
