# Thư viện lớp – Phần A (TypeScript + Vite)

## Chạy
```powershell
npm install
npm run dev
```
Mở địa chỉ Vite hiển thị trong terminal.

## Kiểm tra kiểu và build
```powershell
npm run typecheck
npm run build
npm run preview
```

## Dữ liệu
- `js/api.ts` có hằng `API_URL` trỏ tới MockAPI của dự án (resource `books`: title, author, genre, year).
  Thêm sách gửi `POST`, xóa sách gửi `DELETE`.
- Lần đầu cần nạp dữ liệu mẫu: ở thư mục gốc của bài chạy `node seed.mjs`.
- Muốn chạy không cần mạng: đặt `API_URL = ""`, ứng dụng sẽ đọc `public/books.json` (thêm/xóa chỉ có tác dụng trong phiên).
