import { db } from '@andolab-shop/db-schema';
import { purchaseRepository } from './repository';
import { NoStockError, NotFoundError } from '../../core/errors';

export const purchaseService = {
    purchase: (janCode: string) => {
        return db.transaction((tx) => {
            // 商品検索
            const product = purchaseRepository.findProductByJanCode(
                janCode,
                tx,
            );
            // 商品が存在しない場合の処理
            if (!product) {
                throw new NotFoundError('商品');
            }
            // 在庫がない場合の処理
            if (product.stock <= 0) {
                throw new NoStockError();
            }
            // 在庫を更新処理
            purchaseRepository.decreaseStock(product.productId, tx);
            // 購入履歴を記録
            purchaseRepository.createPurchaseLog(
                {
                    productId: product.productId,
                    price: product.price,
                },
                tx,
            );
            return product;
        });
    },
};
