import { usePurchaseForm } from '../hooks/usePurchaseForm';

function PurchasePage() {
    const {
        inputRef,
        janCode,
        focusInput,
        readBarCode,
        executePurchase,
        lastProduct,
        isProcessing,
    } = usePurchaseForm();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="tex-2xl font-bold mb-4 mt-4">
                商品のバーコードを読み取ってください
            </h1>
            {/* ToDo: バーコードで読み取った商品を表示 */}
            <div className="flex flex-row mb-4">
                <div className="mr-4">
                    読み取った商品の名前: <span>{lastProduct?.name}</span>
                </div>
                <div className="ml-4">
                    読み取った商品の価格: <span>{lastProduct?.price}</span>
                </div>
            </div>
            <div>
                読み取った商品の在庫数: <span>{lastProduct?.stock}</span>
            </div>
            <button className="mt-4 border rounded-sm px-4 py-2 bg-red-500 text-white hover:bg-red-600">
                {/* ToDo: 直前の購入を取り消す機能を実装 */}
                直前の購入を取り消す
            </button>
            <input
                id="barcode-input"
                type="text"
                className="opacity-0"
                value={janCode}
                autoFocus
                ref={inputRef}
                onBlur={focusInput}
                onChange={readBarCode}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isProcessing) executePurchase();
                }}
            />
        </div>
    );
}

export default PurchasePage;
