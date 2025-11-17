import { serve } from "@hono/node-server";
import { db, users } from "@andolab-shop/db-schema";
import { Hono } from "hono";

const app = new Hono();

// GET /user: 全ユーザーを取得するAPI
app.get('/api/users', async (c) => {
    const allUsers = await db.select().from(users).all();
    return c.json(allUsers);
});

// POST /user: テストデータを追加するAPI
app.post('/api/users', async (c) => {
    await db.insert(users).values([
        { name: 'Alice', email: 'alice@example.com'},
        { name: 'Bob', email: 'bob@example.com' },
    ]).onConflictDoNothing().run();
    return c.json({ message: 'Test data inserted'}, 201);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
});