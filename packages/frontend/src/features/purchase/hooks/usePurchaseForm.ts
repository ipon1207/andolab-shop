import React, { useEffect, useRef, useState } from 'react';
import { usePurchase } from './usePurchase';

export const usePurchaseForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [janCode, setJanCode] = useState<string>('');
    const {
        lastProduct,
        lastPurchaseLog,
        isProcessing,
        allProducts,
        executePurchase,
        executePurchaseCancel,
    } = usePurchase();

    // inputフォームにフォーカスを当てる
    const focusInput = () => {
        inputRef.current?.focus();
        // dialogなどの要素が閉じた後にフォーカスを当てるため、少し遅延させる
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    useEffect(() => {
        const handleGlobalMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest(
                'button, input textarea, select a, [role="button"]',
            );
            const isSelectingText = window.getSelection()?.toString();
            if (!isInteractive && !isSelectingText) {
                e.preventDefault();
                focusInput();
            }
        };
        document.addEventListener('mousedown', handleGlobalMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleGlobalMouseDown);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);

    // バーコードの入力値処理
    const readBarCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJanCode(e.target.value);
    };

    // 購入実行
    const handlePurchase = async (targetCode?: string) => {
        const codeToUse = targetCode || janCode;
        const result = await executePurchase(codeToUse);

        if (result.success) {
            setJanCode('');
            focusInput();
        } else {
            alert(result.error);
            focusInput();
        }
    };

    // 購入キャンセル実行
    const handlePurchaseCancel = async () => {
        const result = await executePurchaseCancel();
        if (result.success) {
            alert('購入キャンセル完了');
            focusInput();
        } else {
            alert(result.error);
            focusInput();
        }
    };

    return {
        inputRef,
        janCode,
        lastProduct,
        lastPurchaseLog,
        isProcessing,
        allProducts,
        focusInput,
        readBarCode,
        executePurchase: handlePurchase,
        executePurchaseCancel: handlePurchaseCancel,
    };
};
