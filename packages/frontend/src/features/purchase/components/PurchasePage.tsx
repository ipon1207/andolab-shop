import { usePurchaseForm } from '../hooks/usePurchaseForm';

function PurchasePage() {
    const {
        inputRef,
        janCode,
        focusInput,
        readBarCode,
        executePurchase,
        executePurchaseCancel,
        lastProduct,
        isProcessing,
    } = usePurchaseForm();

    return (
        <div className="w-full h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-800">
            {/* メインエリア: 画面いっぱいに情報を表示 */}
            <main className="flex-1 flex items-center justify-center p-4">
                {lastProduct ? (
                    // --- 購入完了時の表示 ---
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center animate-fade-in">
                        <div className="text-slate-500 font-bold mb-2">
                            購入しました
                        </div>

                        {/* 商品名 */}
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight line-clamp-2 min-h-12">
                            {lastProduct.name}
                        </h2>

                        <div className="flex items-end justify-center gap-6 border-t border-slate-100 pt-6">
                            <div className="text-right">
                                <p className="text-sm text-slate-500 mb-1">
                                    価格
                                </p>
                                <p className="text-6xl font-bold text-blue-600 tracking-tight">
                                    ¥{lastProduct.price}
                                </p>
                            </div>
                            <div className="text-left pb-2">
                                <p className="text-sm text-slate-500 mb-1">
                                    在庫残数
                                </p>
                                <p
                                    className={`text-2xl font-bold ${lastProduct.stock <= 3 ? 'text-red-500' : 'text-slate-700'}`}
                                >
                                    {lastProduct.stock}{' '}
                                    <span className="text-sm font-normal text-slate-400">
                                        個
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- 待機時の表示 ---
                    <div className="text-center opacity-40">
                        <div className="text-8xl mb-4">🛒</div>
                        <p className="text-3xl font-bold">
                            商品をスキャンしてください
                        </p>
                    </div>
                )}
            </main>

            {/* フッター: ステータスとアクションボタン */}
            <footer className="p-4 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex flex-col justify-center gap-1">
                    {/* ステータスインジケーター（ヘッダーから移動） */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}
                        ></span>
                        <span className="text-xs text-slate-500 font-medium">
                            {isProcessing ? '処理中...' : '稼働中'}
                        </span>
                    </div>
                    {/* デバッグ用入力値表示 */}
                    <div className="text-[10px] text-slate-300 font-mono">
                        Input: {janCode}
                    </div>
                </div>

                {/* 直前の購入を取り消すボタン */}
                <button
                    onClick={executePurchaseCancel}
                    disabled={!lastProduct || isProcessing}
                    className={`
                        px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-sm
                        ${
                            !lastProduct
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-95'
                        }
                    `}
                >
                    ↩ 直前の購入を取り消す
                </button>
            </footer>

            {/* バーコード入力用（不可視） */}
            <input
                id="barcode-input"
                type="text"
                className="opacity-0 absolute top-0 left-0 w-0 h-0 overflow-hidden"
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
