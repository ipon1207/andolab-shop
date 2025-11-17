import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema.ts',
  out: './drizzle', // マイグレーションファイルの出力先ディレクトリ
  dialect: 'sqlite',
  dbCredentials: {
    // DBファイルのパス。プロジェクトルートに sqlite.db が作成されるように指定
    url: './sqlite.db',
  },
} satisfies Config;