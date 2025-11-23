import { db } from '@andolab-shop/db-schema';
import { createPurchaseRepository } from './repository';
import { NoStockError, NotFoundError } from '../../core/errors';

export const purchaseService = {
    purchase: (janCode: string) => {
        return db.transaction((tx) => {
            const repo = createPurchaseRepository(tx);
            // 商品検索
            const product = repo.findProductByJanCode(janCode);
            // 商品が存在しない場合の処理
            if (!product) throw new NotFoundError('商品');
            // 在庫がない場合の処理
            if (product.stock <= 0) throw new NoStockError();
            // 在庫を更新処理
            repo.decreaseStock(product.productId);
            product.stock -= 1;
            // 購入履歴を記録
            repo.createPurchaseLog({
                productId: product.productId,
                price: product.price,
            });
            return product;
        });
    },
};
