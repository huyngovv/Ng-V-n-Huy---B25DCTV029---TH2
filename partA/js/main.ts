import { addBook, getBooks, removeBook } from "./api";
import { fillGenres, renderList } from "./render";
import { loadFavs, saveFavs } from "./storage";
import type { Book, BookField } from "./types";
import { validateField } from "./validate";

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Không tìm thấy phần tử giao diện: ${selector}`);
  return element;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const listEl = getElement<HTMLUListElement>("#list");
const statusEl = getElement<HTMLParagraphElement>("#status");
const searchEl = getElement<HTMLInputElement>("#search");
const filterEl = getElement<HTMLSelectElement>("#genreFilter");
const form = getElement<HTMLFormElement>("#addForm");
const favCountEl = getElement<HTMLElement>("#favCount");
const themeButton = getElement<HTMLButtonElement>("#themeBtn");

function getFormField(name: "title" | "author" | "year"): HTMLInputElement;
function getFormField(name: "genre"): HTMLSelectElement;
function getFormField(name: BookField): HTMLInputElement | HTMLSelectElement {
  const field = form.elements.namedItem(name);
  if (name === "genre" && field instanceof HTMLSelectElement) return field;
  if (name !== "genre" && field instanceof HTMLInputElement) return field;
  throw new Error(`Không tìm thấy trường trong biểu mẫu: ${name}`);
}

function isBookField(name: string): name is BookField {
  return name === "title" || name === "author" || name === "genre" || name === "year";
}

let books: Book[] = [];
const favs = loadFavs();
const fields: BookField[] = ["title", "author", "genre", "year"];

function visibleBooks(): Book[] {
  const query = searchEl.value.trim().toLowerCase();
  const genre = filterEl.value;
  return books.filter((book) => book.title.toLowerCase().includes(query) && (!genre || book.genre === genre));
}

function update(): void {
  const shown = visibleBooks();
  renderList(listEl, shown, favs);
  statusEl.className = "";
  statusEl.textContent = `Đang hiển thị ${shown.length} / ${books.length} cuốn`;
  favCountEl.textContent = `♥ ${favs.size} yêu thích`;
}

function refreshGenres(): void {
  fillGenres([
    { el: filterEl, first: "Tất cả thể loại" },
    { el: getFormField("genre"), first: "-- Chọn thể loại --" },
  ], books);
}

async function init(): Promise<void> {
  statusEl.textContent = "Đang tải…";
  try {
    books = await getBooks();
    refreshGenres();
    update();
  } catch (error) {
    statusEl.className = "error";
    statusEl.textContent = "Lỗi tải dữ liệu: " + errorMessage(error);
  }
}

searchEl.addEventListener("input", update);
filterEl.addEventListener("change", update);

listEl.addEventListener("click", async (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;
  const card = button.closest<HTMLLIElement>(".card");
  const id = card?.dataset.id;
  if (!id) return;

  if (button.dataset.action === "fav") {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    saveFavs(favs);
    update();
  } else if (button.dataset.action === "delete") {
    const book = books.find((item) => item.id === id);
    if (!book || !confirm(`Xóa sách "${book.title}"?`)) return;
    try {
      await removeBook(id);
      books = books.filter((item) => item.id !== id);
      favs.delete(id);
      saveFavs(favs);
      refreshGenres();
      update();
    } catch (error) {
      statusEl.className = "error";
      statusEl.textContent = errorMessage(error);
    }
  }
});

function showError(name: BookField): boolean {
  const field = name === "genre" ? getFormField("genre") : getFormField(name);
  const message = validateField(name, field.value);
  getElement<HTMLElement>(`[data-for="${name}"]`).textContent = message;
  return !message;
}

form.addEventListener("input", (event: Event) => {
  const target = event.target;
  if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && isBookField(target.name)) {
    showError(target.name);
  }
});

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  const valid = fields.map(showError).every(Boolean);
  if (!valid) return;

  const data = {
    title: getFormField("title").value.trim(),
    author: getFormField("author").value.trim(),
    genre: getFormField("genre").value,
    year: Number(getFormField("year").value),
  };
  try {
    books.unshift(await addBook(data));
    form.reset();
    refreshGenres();
    update();
  } catch (error) {
    statusEl.className = "error";
    statusEl.textContent = errorMessage(error);
  }
});

const root = document.documentElement;
root.dataset.theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";

function updateThemeButton(): void {
  const isDark = root.dataset.theme === "dark";
  themeButton.textContent = isDark ? "Chế độ sáng" : "Chế độ tối";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

updateThemeButton();
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeButton();
});

void init();
