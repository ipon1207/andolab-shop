import {
    ProductResponseData,
    PurchaseLogResponseData,
} from '@andolab-shop/shared';
import { useState } from 'react';
import { purchaseRepository } from '../api/repository';

export const usePurchase = () => {
    const [lastProduct, setLastProduct] = useState<ProductResponseData | null>(
        null,
    );
    const [lastPurchaseLog, setLastPurchaseLog] =
        useState<PurchaseLogResponseData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const executePurchase = async (
        janCode: string,
    ): Promise<{
        success: boolean;
        error?: string;
        product?: ProductResponseData;
    }> => {
        if (!janCode || isProcessing) {
            return { success: false, error: 'JANコードを入力してください' };
        }

        setIsProcessing(true);
        try {
            const product = await purchaseRepository.purchase(janCode);
            setLastProduct(product);
            return { success: true, product };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : '購入処理に失敗しました';
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    const executePurchaseCancel = async (): Promise<{
        success: boolean;
        error?: string;
        purchaseLog?: PurchaseLogResponseData;
    }> => {
        if (isProcessing) return { success: false, error: '現在処理中です' };
        setIsProcessing(true);
        try {
            const purchaseLog = await purchaseRepository.cancelPurchase();
            setLastPurchaseLog(purchaseLog);
            return { success: true, purchaseLog };
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : '購入キャンセルに失敗しました';
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        lastProduct,
        lastPurchaseLog,
        isProcessing,
        executePurchase,
        executePurchaseCancel,
    };
};
