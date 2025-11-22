import { useRef, useState } from 'react';
import { client } from './api';

function PurchagePage() {
    // 入力フォームの状態管理
    const inputRef = useRef<HTMLInputElement>(null);
    // バーコードの状態管理
    const [janCode, setJanCode] = useState<string>('');

    // 入力フォームにフォーカスを常に当てる
    const alwaysFocus = () => {
        inputRef.current?.focus();
    };

    // バーコード読み取り処理
    const readBarcode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJanCode(e.target.value);
    };

    // バーコード読み取り完了処理
    const enterBarcode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('バーコードが読み取られました:', janCode);
            // デフォルトの挙動を防止
            e.preventDefault();

            try {
                const res = await client.api.purchase.$post({
                    json: { janCode: janCode },
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log('購入成功:', data[0]);
                }
            } catch (error) {
                console.error('購入処理中にエラーが発生しました', error);
            } finally {
                setJanCode('');
            }
        }
    };

    const handleClick = () => {
        console.log('直前の購入を取り消すボタンがクリックされました');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 mt-4">
                商品のバーコードを読み取ってください
            </h1>
            {/* ToDo: バーコードで読み取った商品を表示 */}
            <div className="flex flex-row mb-4">
                <div className="mr-4">
                    読み取った商品の名前: <span>テスト</span>
                </div>
                <div className="ml-4">
                    読み取った商品の価格: <span>1000</span>
                </div>
            </div>
            <div>
                読み取った商品の在庫数: <span>10</span>
            </div>
            <button
                className="mt-4 border rounded-sm px-4 py-2 bg-red-500 text-white hover:bg-red-600"
                onClick={handleClick}
            >
                直前の購入を取り消す
            </button>
            <input
                id="barcode-input"
                type="text"
                className="mt-4 p-2 border rounded-sm opacity-0"
                value={janCode}
                autoFocus
                ref={inputRef}
                onBlur={alwaysFocus}
                onChange={readBarcode}
                onKeyDown={enterBarcode}
            />
        </div>
    );
}

export default PurchagePage;
