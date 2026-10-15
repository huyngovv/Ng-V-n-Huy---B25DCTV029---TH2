// Nạp 11 cuốn sách từ partA/public/books.json lên MockAPI.
// Chạy:  node seed.mjs          (chỉ chạy khi MockAPI đang trống)
//        node seed.mjs --force  (nạp dù đã có dữ liệu)
import { readFileSync } from "node:fs";

const API = process.env.API_URL ?? "https://6ad042cf03feaa52b21f32ad.mockapi.io/books/books";
const force = process.argv.includes("--force");
const books = JSON.parse(readFileSync(new URL("./partA/public/books.json", import.meta.url), "utf8"));

async function main() {
  let existing = [];
  try {
    const res = await fetch(API);
    if (!res.ok) {
      console.error(`MockAPI trả về lỗi ${res.status} khi đọc dữ liệu: ${API}`);
      process.exitCode = 1;
      return;
    }
    existing = await res.json();
  } catch (err) {
    console.error("Không kết nối được MockAPI:", err.message);
    process.exitCode = 1;
    return;
  }

  if (Array.isArray(existing) && existing.length > 0 && !force) {
    console.log(`MockAPI đã có ${existing.length} bản ghi. Xóa chúng trên mockapi.io trước, hoặc chạy: node seed.mjs --force`);
    process.exitCode = 1;
    return;
  }

  let ok = 0;
  for (const { id, ...book } of books) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    console.log(res.status, book.title);
    if (res.ok) ok++;
  }
  console.log(`Xong: ${ok}/${books.length} cuốn.`);
  if (ok !== books.length) process.exitCode = 1;
}

await main();
