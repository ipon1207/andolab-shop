import { ProductResponseData } from '@andolab-shop/shared';
import { useEffect, useRef } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: ProductResponseData) => void;
    filteredProducts: ProductResponseData[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    categories: string[];
};

export const CatalogModal = ({
    isOpen,
    onClose,
    onSelect,
    filteredProducts,
    selectedCategory,
    onSelectCategory,
    categories,
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // <dialog> の開閉制御だけはDOM操作なのでここに残します（または専用のuseDialogフックにしても良いですが、今回はここでOK）
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            className="w-[90vw] h-[85vh] rounded-xl shadow-2xl border-0 p-0 backdrop:bg-black/50"
            onCancel={onClose}
        >
            <div className="flex flex-col h-full bg-slate-50">
                {/* ヘッダー */}
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold">商品カタログ</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* カテゴリタブ */}
                <div className="flex overflow-x-auto gap-2 p-4 border-b border-slate-200 bg-white shrink-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 商品グリッド */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.productId}
                                onClick={() => onSelect(product)}
                                className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-400 active:scale-95 transition-all text-left flex flex-col h-full"
                            >
                                <div className="font-bold text-slate-800 mb-1 line-clamp-2 flex-1">
                                    {product.name}
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                        {product.type}
                                    </span>
                                    <span className="text-lg font-bold text-blue-600">
                                        ¥{product.price}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-slate-400 py-12">
                            商品が見つかりません
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    );
};
