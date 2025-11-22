import React, { useRef, useState } from 'react';
import { purchaseRepository } from '../api/repository';

export const usePurchase = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [janCode, setJanCode] = useState<string>('');

    // inputフォームにフォーカスを当てる
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // バーコードの入力値処理
    const reacBarCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJanCode(e.target.value);
    };

    // 購入実行（Enterキー押下時）
    const executePurchase = async (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        console.log('バーコードが読み取られました:', janCode);

        try {
            const product = await purchaseRepository.purchase(janCode);
            console.log('購入成功:', product);
        } catch (error) {
            console.error(error);
            alert(
                error instanceof Error ? error.message : 'エラーが発生しました',
            );
        } finally {
            setJanCode('');
        }
    };

    return {
        inputRef,
        janCode,
        focusInput,
        reacBarCode,
        executePurchase,
    };
};
