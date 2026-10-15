import type { Book, NewBook } from "./types";

// URL MockAPI của dự án. Để trống ("") = dùng public/books.json (chỉ đọc, thêm/xóa không lưu).
export const API_URL = "https://6ad042cf03feaa52b21f32ad.mockapi.io/books/books";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Chuyển 1 bản ghi bất kỳ thành Book; trả về null nếu thiếu dữ liệu. */
function toBook(value: unknown): Book | null {
  if (!isRecord(value)) return null;
  const { id, title, author, genre } = value;
  const year = Number(value.year);
  if (
    (typeof id !== "string" && typeof id !== "number") ||
    typeof title !== "string" || !title ||
    typeof author !== "string" ||
    typeof genre !== "string" || !genre ||
    !Number.isFinite(year)
  ) {
    return null;
  }
  return { id: String(id), title, author, genre, year };
}

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(API_URL || "./books.json");
  if (!res.ok) throw new Error("Máy chủ trả về lỗi " + res.status);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("Dữ liệu sách không đúng định dạng.");
  // Bỏ qua bản ghi hỏng thay vì làm hỏng cả danh sách
  return data.map(toBook).filter((book): book is Book => book !== null);
}

export async function addBook(book: NewBook): Promise<Book> {
  if (!API_URL) return { ...book, id: String(Date.now()) };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Không thêm được sách");
  const created = toBook(await res.json());
  if (!created) throw new Error("Máy chủ trả về dữ liệu sách không hợp lệ.");
  return created;
}

export async function removeBook(id: string): Promise<void> {
  if (!API_URL) return;
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không xóa được sách");
}
