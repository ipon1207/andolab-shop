import React, { useEffect, useRef, useState } from 'react';
import { usePurchase } from './usePurchase';

export const usePurchaseForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [janCode, setJanCode] = useState<string>('');
    const { lastProduct, isProcessing, executePurchase } = usePurchase();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // inputフォームにフォーカスを当てる
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // バーコードの入力値処理
    const readBarCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJanCode(e.target.value);
    };

    // 購入実行
    const handlePurchase = async () => {
        const result = await executePurchase(janCode);

        if (result.success) {
            alert(`購入完了: ${result.product?.name}`);
            setJanCode('');
            focusInput();
        } else {
            alert(result.error);
        }
    };

    return {
        inputRef,
        janCode,
        lastProduct,
        isProcessing,
        focusInput,
        readBarCode,
        executePurchase: handlePurchase,
    };
};
