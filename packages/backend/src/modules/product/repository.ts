import { db, products } from '@andolab-shop/db-schema';
import { eq } from 'drizzle-orm';

export const productRepository = {
    finaAll: () => {
        return db
            .select()
            .from(products)
            .where(eq(products.isDeleted, false))
            .all();
    },
};
