import { db } from '@andolab-shop/db-schema';
import { purchaseRepository } from './repository';

export const purchaseService = {
    purchase: (janCode: string) => {
        return db.transaction((tx) => {
            // 商品検索
            const targetProduct = purchaseRepository.findProductByJanCode(
                janCode,
                tx,
            );
            // 商品が存在しない or 在庫がない場合の処理
            if (targetProduct.length === 0 || targetProduct[0].stock <= 0) {
                throw new Error('NOT_FOUND_OR_NO_STOCK');
            }
            // 在庫を更新処理
            purchaseRepository.decreaseStock(targetProduct[0].productId, tx);
            // 購入履歴を記録
            purchaseRepository.createPurchaseLog(
                {
                    productId: targetProduct[0].productId,
                    price: targetProduct[0].price,
                },
                tx,
            );
            return targetProduct;
        });
    },
};
