import { useProductList } from '../hooks/useProductList';

export const ProductListPage = () => {
    const { products, isLoading, error } = useProductList();

    if (isLoading) return <div className="p-8 text-center">読み込み中...</div>;
    if (error)
        return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">商品一覧・在庫確認</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                    JANコード
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                    商品名
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                    種類
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                                    価格
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                                    在庫数
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr
                                    key={product.productId}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                        {product.janCode}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                            {product.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                        ¥{product.price.toLocaleString()}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-sm text-right font-bold ${
                                            product.stock <= 0
                                                ? 'text-red-600'
                                                : 'text-blue-600'
                                        }`}
                                    >
                                        {product.stock}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
