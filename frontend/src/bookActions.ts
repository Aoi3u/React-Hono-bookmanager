import { BookManage, BookManageJson, BookState } from "./domain/book";

export const handleAddBook = async (
  prevState: BookState,
  formData: FormData
): Promise<BookState> => {
  const name = formData.get("bookName") as string;

  if (!name) {
    throw new Error("Book name is required");
  }

  const response = await fetch("http://localhost:8080/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to add book");
  }

  const newBook = await response.json();

// 新しい書籍を追加する
// 新しい書籍を追加するときは、allBooksとfilteredBooksの両方に追加する
// filteredBooksは、キーワード検索の結果を保持するための変数
// キーワード検索の結果を保持するためには、filteredBooksに新しい書籍を追加する必要がある
// ただし、filteredBooksがnullの場合は、新しい書籍を追加しない
  return {
    ...prevState,
    allBooks: [...prevState.allBooks, newBook],
    filteredBooks: prevState.filteredBooks
      ? [...prevState.filteredBooks, newBook]
      : null,
  };
};

export const handleSearchBooks = async (
  prevState: BookState,
  formData: FormData
): Promise<BookState> => {
  const keyword = formData.get("keyword") as string;

  if (!keyword) {
    throw new Error("Keyword is required");
  }

// filter関数を使って、キーワードが含まれる書籍だけを残す
// この処理は、サーバーサイドで行うことができる
// ただし、サーバーサイドで行う場合は、データの取得に時間がかかるため、
// クライアントサイドで行うことが一般的
  const response = await fetch(
    `http://localhost:8080/books?keyword=${keyword}`
  );
  const data = (await response.json()) as BookManageJson[];
  const filteredBooks = data.map(
    (book) => new BookManage(book.id, book.name, book.status)
  );

  return {
    ...prevState,
    filteredBooks,
    keyword,
  };
};
