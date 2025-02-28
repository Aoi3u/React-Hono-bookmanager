import { use, useActionState, useRef } from "react";
import { BookManage, BookManageJson, BookState } from "./domain/book";
import { handleAddBook, handleSearchBooks, handleUpdateBook } from "./bookActions";

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
  // useRef関数を使って、フォームの参照を取得
  const searchFormRef = useRef<HTMLFormElement>(null);
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

      const action = formData.get("formType") as string;

      const actionHandlers = {
        add: () => handleAddBook(prevState, formData),
        search: () => handleSearchBooks(prevState, formData),
        update: () => handleUpdateBook(prevState, formData),
      } as const;

      if (action != "add" && action !== "search" && action !== "update") {
        throw new Error(`Invalid action: ${action}`);
      }

      return actionHandlers[action]();
    },
    {
      allBooks: initialBooks,
      filteredBooks: null,
      keyword: "",
    }
  );

  const books = bookState.filteredBooks || bookState.allBooks;

  return (
    <>
      <div>
        <form action={updateBookState} ref={addFormRef}>
          <input type="hidden" name="formType" value="add" />
          <input type="text" name="bookName" placeholder="書籍名" />
          <button type="submit" disabled={isPending}>
            追加
          </button>
        </form>
        <form ref={searchFormRef} action={updateBookState}>
          <input type="hidden" name="formType" value="search" />
          <input type="text" name="keyword" placeholder="書籍名で検索" />
          <button type="submit" disabled={isPending}>
            検索
          </button>
        </form>
        <div>
          <ul>
          {books.map((book: BookManage) => {
              const bookStatus = book.status;
              return (
                <li key={book.id}>
                  {book.name}
                  <form action={updateBookState}>
                    <input type="hidden" name="formType" value="update" />
                    <input type="hidden" name="id" value={book.id} />
                    <select
                      key={`select-${book.id}-${bookStatus}`}
                      name="status"
                      defaultValue={bookStatus}
                      onChange={(e) => {
                        e.target.form?.requestSubmit();
                      }}
                    >
                      <option value="在庫あり">在庫あり</option>
                      <option value="貸出中">貸出中</option>
                      <option value="返却済">返却済</option>
                    </select>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
