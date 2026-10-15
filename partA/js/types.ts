export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
}

export type NewBook = Omit<Book, "id">;

export type BookField = "title" | "author" | "genre" | "year";
