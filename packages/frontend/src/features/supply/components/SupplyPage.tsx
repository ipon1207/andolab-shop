import { useSupply } from '../hooks/useSupply';
import { CatalogModal } from './CatalogModal';
import { useCatalog } from '../hooks/useCatalog';

export const SupplyPage = () => {
    const {
        allProducts,
        supplyList,
        isProcessing,
        addRow,
        updateRow,
        removeRow,
        submitSupply,
        addFromCatalog,
    } = useSupply();

    const catalog = useCatalog(allProducts);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        仕入れ登録（一括）
                    </h1>
                    <div className="text-right">
                        <span className="text-gray-600 mr-4">
                            登録予定: <strong>{supplyList.length}</strong> 件
                        </span>
                        <button
                            onClick={submitSupply}
                            disabled={isProcessing || supplyList.length === 0}
                            className={`px-6 py-2 rounded text-white font-bold transition-colors ${
                                isProcessing || supplyList.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isProcessing ? '送信中...' : '一括登録する'}
                        </button>
                    </div>
                </div>

                {/* スプレッドシート風テーブル */}
                <div className="overflow-x-auto border border-gray-200 rounded-md mb-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                    JANコード
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    商品名
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    売値(円)
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    種類
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    仕入れ数
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    削除
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {supplyList.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={row.janCode}
                                            onChange={(e) =>
                                                updateRow(
                                                    row.id,
                                                    'janCode',
                                                    e.target.value,
                                                )
                                            }
                                            list="product-suggestions"
                                            placeholder="スキャン / 商品名"
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={row.productName}
                                            onChange={(e) =>
                                                updateRow(
                                                    row.id,
                                                    'productName',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="number"
                                            value={row.price}
                                            onChange={(e) =>
                                                updateRow(
                                                    row.id,
                                                    'price',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border text-right"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="text"
                                            value={row.type}
                                            onChange={(e) =>
                                                updateRow(
                                                    row.id,
                                                    'type',
                                                    e.target.value,
                                                )
                                            }
                                            list="type-options" // 候補を出せると便利
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border"
                                        />
                                        <datalist id="type-options">
                                            <option value="お菓子" />
                                            <option value="飲み物（ペットボトル）" />
                                            <option value="飲み物（缶）" />
                                            <option value="軽食" />
                                            <option value="アイス" />
                                        </datalist>
                                    </td>
                                    <td className="px-2 py-2">
                                        <input
                                            type="number"
                                            value={row.quantity}
                                            onChange={(e) =>
                                                updateRow(
                                                    row.id,
                                                    'quantity',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border text-right bg-yellow-50 font-bold"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                            tabIndex={-1} // Tabキーでここに止まらないようにする（入力効率化）
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* データがない時の表示 */}
                            {supplyList.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-400 text-sm"
                                    >
                                        下のボタンから行を追加するか、バーコードをスキャンして入力を開始してください
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <datalist id="product-suggestions">
                    {allProducts.map((product) => (
                        <option
                            key={product.productId}
                            value={product.janCode || ''}
                        >
                            {product.name}
                        </option>
                    ))}
                </datalist>

                <button
                    onClick={addRow}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="text-xl">+</span> 行を追加する
                </button>
                <button
                    onClick={catalog.open}
                    className="py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <span className="text-xl">📖</span> カタログから選ぶ
                </button>
                {/* ★追加: モーダルコンポーネント */}
                <CatalogModal
                    isOpen={catalog.isOpen}
                    onClose={catalog.close}
                    onSelect={(product) => {
                        addFromCatalog(product);
                        catalog.close(); // 選択したら閉じる
                    }}
                    filteredProducts={catalog.filteredProducts}
                    selectedCategory={catalog.selectedCategory}
                    onSelectCategory={catalog.selectCategory}
                    categories={catalog.categories}
                />
            </div>
        </div>
    );
};

export default SupplyPage;
