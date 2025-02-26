import {use} from "react";
import { BookManage, BookManageJson } from "./domain/book";

// 書籍データを取得する関数
async function fetchManageBooks() {
  // 1秒待ってから書籍データを取得
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // fetch関数を使って、http://localhost:8080/booksにGETリクエストを送る
  const response = await fetch("http://localhost:8080/books");
  // レスポンスのjsonを取得
  const data = (await response.json()) as BookManageJson[];
  // BookManageのインスタンスの配列に変換して返す
  return data.map((book) => new BookManage(book.id, book.name, book.status));
}

// 書籍データを取得するPromise
const fetchManageBookPromise = fetchManageBooks();

function App() {
  // use関数を使って、fetchManageBookPromiseが完了するまで待つ
  const initialBooks = use(fetchManageBookPromise);

  return (
    <>
      <div>
        <div>
          <ul>
            {initialBooks.map((book: BookManage) => {
              return <li key={book.id}>{book.name}</li>;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App
