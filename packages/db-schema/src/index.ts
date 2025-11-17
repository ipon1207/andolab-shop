import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// プロジェクトルートにあるDBファイルに接続
const sqlite = new Database('../../sqlite.db');

// Drizzleインスタンスを作成。schemaを渡すことで型推論が効くようになります
export const db = drizzle(sqlite, { schema });

// スキーマも再エクスポートしておくと便利
export * from './schema';