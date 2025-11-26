import { BulkSupplyitem, ProductListResponseData } from '@andolab-shop/shared';
import { useCallback, useEffect, useState } from 'react';
import { supplyRepository } from '../api/repository';

// 画面表示用に、BulkSupplyItemにid（一時的な行ID）をつけた型を定義
type SupplyRow = BulkSupplyitem & { id: string };

// ID生成関数
const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(26);
};

export const useSupply = () => {
    const [allProducts, setAllProducts] = useState<ProductListResponseData>([]);
    const [supplyList, setSupplyList] = useState<SupplyRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 商品マスタを取得する関数
    const fetchLatestProducts = useCallback(async () => {
        try {
            const products = await supplyRepository.fetchAllProducts();
            setAllProducts(products);
        } catch (e) {
            console.error(e);
        }
    }, []);

    // 初回ロード時に全商品を取得
    useEffect(() => {
        fetchLatestProducts();
    }, [fetchLatestProducts]);

    // 行を追加する関数
    const addRow = () => {
        setSupplyList((prev) => [
            ...prev,
            {
                id: generateId(), // 一意なID
                janCode: '',
                productName: '',
                price: 0,
                type: '',
                quantity: 0,
            },
        ]);
    };

    // 行の値を更新する関数
    const updateRow = (
        id: string,
        key: keyof BulkSupplyitem,
        value: string | number,
    ) => {
        setSupplyList((prev) =>
            prev.map((row) => {
                if (row.id !== id) return row;
                // JANコードが変更された場合、マスタから検索して自動入力
                if (key === 'janCode' && typeof value === 'string') {
                    const found = allProducts.find((p) => p.janCode === value);
                    if (found) {
                        return {
                            ...row,
                            janCode: value,
                            productName: found.name,
                            price: found.price,
                            type: found.type,
                        };
                    }
                }
                return { ...row, [key]: value };
            }),
        );
    };

    // 行を削除する関数
    const removeRow = (id: string) => {
        setSupplyList((prev) => prev.filter((row) => row.id !== id));
    };

    // 一括登録を実行
    const submitSupply = async () => {
        if (supplyList.length === 0) return;
        if (isProcessing) return;

        // バリデーション: 空欄があるかチェック
        const hasEmpty = supplyList.some(
            (row) => !row.janCode || !row.productName || row.quantity < 0,
        );
        if (hasEmpty) {
            alert('仕入れ情報に未入力または不正な値があります');
            return;
        }

        setIsProcessing(true);
        try {
            // idを除外してAPIに送信
            const requestData = supplyList.map((row) => ({
                janCode: row.janCode,
                productName: row.productName,
                price: row.price,
                type: row.type,
                quantity: row.quantity,
            }));
            const res = await supplyRepository.registerBulkSupply(requestData);

            alert(res.message);
            // 登録成功後、仕入れリストをクリア
            setSupplyList([]);
            await fetchLatestProducts();
        } catch (e) {
            alert(e instanceof Error ? e.message : 'エラーが発生しました');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        allProducts,
        supplyList,
        isProcessing,
        addRow,
        updateRow,
        removeRow,
        submitSupply,
    };
};
