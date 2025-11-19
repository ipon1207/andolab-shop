import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PurchagePage from './PurchasePage';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PurchagePage />
    </StrictMode>,
);
