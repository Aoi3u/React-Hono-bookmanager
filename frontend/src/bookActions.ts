import { BookState } from "./domain/book";

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

  return {
    ...prevState,
    allBooks: [...prevState.allBooks, newBook],
  };
};
