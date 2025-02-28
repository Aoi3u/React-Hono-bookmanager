import { use, useActionState, useRef } from "react";
import { BookManage, BookManageJson, BookState } from "./domain/book";
import { handleAddBook } from "./bookActions";

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
  // useRef関数を使って、フォームの参照を取得
  // useRef関数は、Reactのrefと同じように、DOM要素を参照するための関数
  const addFormRef = useRef<HTMLFormElement>(null);
  // useActionState関数を使って、書籍データの状態を管理
  const [bookState, updateBookState, isPending] = useActionState(
    async (
      // prevStateは前回の状態
      prevState: BookState | undefined,
      formData: FormData
    ): Promise<BookState> => {
      // prevStateがない場合はエラーを返す
      if (!prevState) {
        throw new Error("Invalid state");
      }

      return handleAddBook(prevState, formData);
    },
    {
      allBooks: initialBooks,
    }
  );

  return (
    <>
      <div>
        <form action={updateBookState} ref={addFormRef}>
          <input type="text" name="bookName" placeholder="書籍名" />
          <button type="submit" disabled={isPending}>
            追加
          </button>
        </form>
        <div>
          <ul>
            {bookState.allBooks.map((book: BookManage) => {
              return <li key={book.id}>{book.name}</li>;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
