import type { BookField } from "./types";

export function validateField(name: BookField, value: string): string {
  const v = value.trim();
  const maxYear = new Date().getFullYear();
  switch (name) {
    case "title": return v.length >= 3 ? "" : "Tên sách phải từ 3 ký tự.";
    case "author": return v ? "" : "Vui lòng nhập tác giả.";
    case "genre": return v ? "" : "Vui lòng chọn thể loại.";
    case "year": {
      const year = Number(v);
      return Number.isInteger(year) && year >= 1900 && year <= maxYear
        ? ""
        : `Năm phải từ 1900 đến ${maxYear}.`;
  }
  }
}
