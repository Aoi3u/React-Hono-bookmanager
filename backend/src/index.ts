import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// テストデータおよび今回扱う書籍管理データの型定義
type BookManager = {
  id: number;
  name: string;
  status: string;
};
const bookManager: BookManager[] = [
  { id: 1, name: "React入門", status: "在庫あり" },
  { id: 2, name: "TypeScript入門", status: "貸出中" },
  { id: 3, name: "Next.js入門", status: "返却済" },
];

// キーワード検索した書籍データを取得する
app.get("/books", async (c) => {
  // キーワードがクエリにあるなら、そのキーワードを含む書籍データを返す
  const query = c.req.query();
  const keyword = query.keyword;
  if (keyword) {
    // book.nameにキーワードが含まれるなら残す処理
    return c.json(bookManager.filter((book) => book.name.includes(keyword)));
  }

  return c.json(bookManager);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
