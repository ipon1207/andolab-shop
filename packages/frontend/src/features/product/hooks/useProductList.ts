import { ProductListResponseData } from '@andolab-shop/shared';
import { useEffect, useState } from 'react';
import { productRepository } from '../api/repository';

export const useProductList = () => {
    const [products, setProducts] = useState<ProductListResponseData>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await productRepository.fetchAll();
                setProducts(data);
            } catch (e) {
                setError(
                    e instanceof Error ? e.message : 'エラーが発生しました',
                );
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);
    return { products, isLoading, error };
};
