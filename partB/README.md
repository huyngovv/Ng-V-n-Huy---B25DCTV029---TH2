# Thư viện lớp – React (Phần B)

Chạy: `npm install` rồi `npm run dev`.

## So sánh Phần A (DOM thuần) và Phần B (React)

| Tiêu chí | Phần A – DOM thuần | Phần B – React |
|---|---|---|
| Cách cập nhật giao diện | Tự gọi `createElement`, `replaceChildren`, `textContent` mỗi khi dữ liệu đổi (hàm `update()`). | Chỉ gọi `setState`; React tự vẽ lại phần thay đổi. |
| Nơi giữ dữ liệu | Biến `books`, `favs` rời rạc; phải nhớ cập nhật header + danh sách. | `useState` trong `App`, giao diện luôn suy ra từ state nên không bị lệch. |
| Chia nhỏ giao diện | Chia theo module JS (api, render, validate…), HTML nằm riêng. | Chia theo component (Header, BookCard…), mỗi component gồm cả giao diện và logic nhỏ. |
| Xử lý sự kiện | Event delegation trên `<ul>`, đọc `data-action` / `data-id`. | `onClick` gắn thẳng vào nút, truyền hàm xuống qua props. |
| Danh sách | Tạo lại toàn bộ thẻ mỗi lần render. | `map` + `key` để React nhận diện từng phần tử. |
| Bảo mật XSS | An toàn nếu dùng `textContent`; dễ sai nếu dùng `innerHTML`. | JSX tự escape nội dung. |
| Nhược điểm | Code dài, dễ sót bước cập nhật khi ứng dụng lớn. | Cần công cụ build (Vite) và học khái niệm mới (state, props). |

Kết luận: ứng dụng nhỏ thì DOM thuần đủ nhẹ và dễ hiểu; khi nhiều phần giao diện phụ thuộc cùng một dữ liệu, React giúp code ngắn và ít lỗi hơn.
