import { ProductResponseData } from '@andolab-shop/shared';
import { Product } from '@andolab-shop/db-schema';
import { productRepository } from './repository';

/**
 * DB型からAPIレスポンス型への変換
 */
const toProductResponse = (product: Product): ProductResponseData => {
    return {
        productId: product.productId,
        janCode: product.janCode ?? '',
        name: product.productName,
        price: product.price,
        type: product.type,
        stock: product.stock,
    };
};

export const productService = {
    /**
     * 全商品を取得する
     */
    findAll: (): ProductResponseData[] => {
        const products = productRepository.findAll();
        return products.map(toProductResponse);
    },
};
