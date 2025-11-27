import { ProductListResponseData } from '@andolab-shop/shared';
import { useMemo, useState } from 'react';

export const CATEGORIES = [
    'すべて',
    'お菓子',
    '飲み物（ペットボトル）',
    '飲み物（缶）',
    '軽食',
    'アイス',
    'その他',
];

export const useCatalog = (allProducts: ProductListResponseData) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('すべて');

    // モーダルを開く
    const open = () => setIsOpen(true);

    // モーダルを閉じる
    const close = () => {
        setIsOpen(false);
        setSelectedCategory('すべて');
    };

    // カテゴリ選択
    const selectCategory = (category: string) => {
        setSelectedCategory(category);
    };

    // フィルタリングロジック
    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            if (selectedCategory === 'すべて') return true;
            return product.type === selectedCategory;
        });
    }, [allProducts, selectedCategory]);

    return {
        isOpen,
        open,
        close,
        selectedCategory,
        selectCategory,
        filteredProducts,
        categories: CATEGORIES,
    };
};
