import { db, users } from '.';

// 開発用の初期データを投入する関数
async function main() {
    console.log('🌱 Seeding database...');

    // --- 1. 既存データのクリーンアップ（本番環境では絶対に使用しない）---
    console.log('Deleting existing data...');
    await db.delete(users);
    // 他にテーブルがあれば、ここに追加
    // await db.delete(products);

    // --- 2. 初期データの定義 ---
    const testUsers = [
        {
            name: 'Alice',
            email: 'alice@example.com',
        },
        {
            name: 'Bob',
            email: 'bob@example.com',
        },
    ];

    // --- 3. 初期データの投入 ---
    console.log('📝 Inserting new seed data...');
    await db.insert(users).values(testUsers);
    // 他にテーブルがあれば、ここに追加
    // await db.insert(products).values(testProducts);

    console.log('✅ Database seeding completed.');
}

// --- スクリプトの実行とエラーハンドリング ---
main().catch((e) => {
    console.error('❌ An error occurred while seeding the database:', e);
    process.exit(1);
});
