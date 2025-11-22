import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PurchasePage from './featrures/purchase/components/PurchasePage';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PurchasePage />
    </StrictMode>,
);
