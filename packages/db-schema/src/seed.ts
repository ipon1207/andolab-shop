import { db, products, purchaseLogs } from '.';

// 開発用の初期データを投入する関数
async function main() {
    console.log('🌱 Seeding database...');

    // --- 1. 既存データのクリーンアップ（本番環境では絶対に使用しない）---
    console.log('Deleting existing data...');
    await db.delete(products);
    // 他にテーブルがあれば、ここに追加
    // await db.delete(products);

    // --- 2. 初期データの定義 ---
    const testProducts = [
        {
            productName: 'テスト用商品',
            price: 1000,
            type: 'お菓子',
            stock: 9999,
            janCode: '1234567890123',
            isDeleted: false,
        },
    ];
    // --- 3. 初期データの投入 ---
    console.log('📝 Inserting new seed data...');
    const returnIds = await db
        .insert(products)
        .values(testProducts)
        .returning({ productId: products.productId });

    const testPurchaseLogs = [
        {
            productId: returnIds[0].productId,
            soldAt: new Date('2024-01-01T10:00:00Z'),
            soldPrice: 900,
        },
    ];

    await db.insert(purchaseLogs).values(testPurchaseLogs);

    console.log('✅ Database seeding completed.');
}

// --- スクリプトの実行とエラーハンドリング ---
main().catch((e) => {
    console.error('❌ An error occurred while seeding the database:', e);
    process.exit(1);
});
