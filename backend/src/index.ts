import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

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

app.use(
  "/*",
  // CORS設定
  // ここでは、http://localhost:5173からのリクエストを許可している
  // 他のオプションは公式ドキュメントを参照
  cors({
    origin: ["http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 3600,
    credentials: true,
  })
);

// キーワード検索した書籍データを取得する
app.get("/books", async (c) => {
  // キーワードがクエリにあるなら、そのキーワードを含む書籍データを返す
  // クエリパラメータはreq.query()で取得できる
  const query = c.req.query();
  const keyword = query.keyword;
  if (keyword) {
    // book.nameにキーワードが含まれるなら残す処理
    return c.json(bookManager.filter((book) => book.name.includes(keyword)));
  }

  return c.json(bookManager);
});

// 書籍データを追加する
app.post("/books", async (c) => {
  // リクエストボディから書籍データを取得
  // リクエストボディはreq.json()で取得できる
  // awaitを使うためには、関数がasyncである必要がある
  // awaitはPromiseを返す関数の前につけることで、その関数が完了するまで待つことができる
  const body = await c.req.json();
  const name = body.name;

  if (name === "") {
    return c.json({ error: "書籍名は必須です" });
  }

  // 新しいBookManagerのオブジェクト
  const newBook = {
    id: bookManager.length + 1,
    name: name,
    status: "在庫あり",
  };

  bookManager.push(newBook);
  return c.json(newBook);
});

// ステータスを更新
app.put("/books/:id", async (c) => {
  // パラメータからidを取得
  // パラメータはreq.param()で取得できる
  const id = c.req.param("id");
  const body = await c.req.json();
  const status = body.status;

  const book = bookManager.find((book) => book.id === Number(id));

  // 書籍が見つからない場合はエラーを返す
  if (!book) {
    return c.json({ error: "書籍が見つかりません" });
  }

  book.status = status;
  return c.json(book);
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
