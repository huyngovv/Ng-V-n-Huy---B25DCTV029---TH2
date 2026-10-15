import type { Book } from "./types";

export function createCard(book: Book, isFav: boolean): HTMLLIElement {
  const li = document.createElement("li");
  li.className = "card";
  li.dataset.id = book.id;

  const h3 = document.createElement("h3");
  h3.textContent = book.title;
  const author = document.createElement("p");
  author.textContent = `Tác giả: ${book.author}`;
  const meta = document.createElement("p");
  meta.textContent = `${book.genre} · ${book.year}`;

  const actions = document.createElement("div");
  actions.className = "actions";
  const fav = document.createElement("button");
  fav.type = "button";
  fav.dataset.action = "fav";
  fav.className = isFav ? "on" : "";
  fav.textContent = isFav ? "♥ Đã thích" : "♡ Yêu thích";
  const del = document.createElement("button");
  del.type = "button";
  del.dataset.action = "delete";
  del.className = "del";
  del.textContent = "Xóa";
  actions.append(fav, del);

  li.append(h3, author, meta, actions);
  return li;
}

export function renderList(container: HTMLUListElement, books: Book[], favs: Set<string>): void {
  container.replaceChildren(...books.map((book) => createCard(book, favs.has(book.id))));
}

export function fillGenres(
  selects: Array<{ el: HTMLSelectElement; first: string }>,
  books: Book[],
): void {
  const genres = [...new Set(books.map((book) => book.genre))];
  for (const { el, first } of selects) {
    const current = el.value;
    el.replaceChildren(new Option(first, ""), ...genres.map((genre) => new Option(genre, genre)));
    el.value = genres.includes(current) ? current : "";
  }
}
