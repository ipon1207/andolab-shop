import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PurchasePage from './features/purchase/components/PurchasePage';
import SupplyPage from './features/supply/components/SupplyPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ルートパス: 購入画面 */}
                <Route path="/" element={<PurchasePage />} />
                {/* /supply: 仕入れ画面 */}
                <Route path="/supply" element={<SupplyPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
