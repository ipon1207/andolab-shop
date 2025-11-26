import { db } from '@andolab-shop/db-schema';
import { createPurchaseRepository } from './repository';
import {
    NoStockError,
    NotFoundCancelablePurchaseError,
    NotFoundError,
} from '../../core/errors';
import { sendDiscordNotification } from '../../utils/discord';

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

            // Discord通知
            if (product.stock === 0) {
                sendDiscordNotification(
                    `🚨 **在庫切れ！**\n商品名: ${product.productName} が売り切れました。補充してください！`,
                );
            } else if (product.stock === 5) {
                sendDiscordNotification(
                    `⚠️ **在庫わずか**\n商品名: ${product.productName} の残りが 5個 になりました!`,
                );
            }
            // 購入履歴を記録
            repo.createPurchaseLog({
                productId: product.productId,
                price: product.price,
            });
            return product;
        });
    },
    cancelPurchase: () => {
        return db.transaction((tx) => {
            const repo = createPurchaseRepository(tx);
            // 最新の購入履歴を取得
            const latestLog = repo.findLatestPurchaseLog();
            // キャンセル可能な購入履歴が存在しない場合の処理
            if (!latestLog) throw new NotFoundCancelablePurchaseError();
            // 在庫を戻す処理
            repo.increaseStock(latestLog.productId);
            // 購入履歴をキャンセル済みに更新
            repo.markAsCanceled(latestLog.logId);
            // 消去した履歴を返す
            return latestLog;
        });
    },
};
