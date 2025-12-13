# Simple MIDI Editor

Tài liệu ngắn gọn hướng dẫn cài đặt và chạy song song frontend (Create React App) và backend (NestJS) trên macOS / Linux.

## Mục lục

- Giới thiệu
- Yêu cầu
- Cấu trúc dự án
- Thiết lập chung
- Frontend (CRA)
- Backend (NestJS)
- Chạy đồng thời (local)
- Biến môi trường mẫu
- Lệnh hữu ích
- Khắc phục sự cố

## Giới thiệu

Project gồm hai phần:

- Frontend: thư mục `frontend` — ứng dụng Create React App.
- Backend: thư mục `backend` — ứng dụng NestJS.

Ví dụ đường dẫn cục bộ:  
`/Users/linhpham/WorkingPlace/Coding/simple-midi-editor/frontend`  
`/Users/linhpham/WorkingPlace/Coding/simple-midi-editor/backend`

## Yêu cầu

- Node.js v16+ (dùng nvm để quản lý)
- npm / yarn / pnpm
- Git
- Docker & Docker Compose (nếu muốn chạy bằng container)
- Cơ sở dữ liệu: SQLite

## Thiết lập chung

1. Clone repo:

```bash
git clone <repo-url>
cd <repo-root>
```

2. Chuyển Node version nếu cần:

```bash
# nếu dùng nvm
nvm install --lts
nvm use --lts
```

## Frontend (Create React App)

1. Vào thư mục frontend:

```bash
cd frontend
```

2. Tạo file .env (xem mẫu bên dưới).
3. Cài dependencies:

```bash
npm install
# hoặc
yarn
```

4. Chạy dev:

```bash
npm start
# hoặc
yarn start
```

- Mặc định CRA chạy trên `http://localhost:3000`.
- Nếu backend API khác port, chỉnh `REACT_APP_API_URL`.

### Build production

```bash
npm run build
# hoặc
yarn build
```

## Backend (NestJS)

1. Vào thư mục backend:

```bash
cd backend
```

2. Tạo file .env (xem mẫu bên dưới).
3. Cài dependencies:

```bash
npm install
# hoặc
yarn
```

4. Chạy dev (hot-reload):

```bash
npm run start:dev
# hoặc
yarn start:dev
```

- Mặc định backend có thể chạy trên `http://localhost:4000` (theo `PORT` trong .env).

### Build & chạy production

```bash
npm run build
node dist/main.js
# hoặc
npm run start:prod
```

## Chạy đồng thời (local)

Mở 2 terminal:

- Terminal A (backend):

```bash
cd backend
npm run start:dev
```

- Terminal B (frontend):

```bash
cd frontend
npm start
```

Mở frontend: `http://localhost:3000` — frontend gọi API `REACT_APP_API_URL` (ví dụ `http://localhost:4000`).

## Biến môi trường mẫu

Frontend (`frontend/.env.example`):

```env
REACT_APP_API_URL=http://localhost:4000
# thêm biến khác bắt đầu bằng REACT_APP_
```

Backend (`backend/.env.example`):

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=db/midi-editor.sqlite
# các biến khác tuỳ project
```

> Với CRA: biến môi trường phải bắt đầu bằng `REACT_APP_` để truy cập trong code.

## Lệnh hữu ích tóm tắt

Frontend:

```bash
# cài
npm install
# dev
npm start
# build
npm run build
# test
npm test
```

Backend:

```bash
# cài
npm install
# dev
npm run start:dev
# build
npm run build
# prod
npm run start:prod
```

## Khắc phục sự cố thường gặp

- CORS: bật CORS ở backend hoặc dùng proxy trong `frontend/package.json`:

```json
"proxy": "http://localhost:4000"
```

- Env không load: restart dev server sau khi đổi `.env`.
- DB connection: kiểm tra `DATABASE_URL`, DB đang chạy hay chưa.
- Node version mismatch: dùng `nvm use`.

## Chạy bằng Docker (docker-compose)

Thêm hướng dẫn chạy toàn bộ stack bằng Docker Compose. project đã bao gồm `docker-compose.yml` ở root.

### Yêu cầu
- Docker (Engine) và Docker Compose (hoặc Docker Desktop trên macOS).
- (Tùy cấu hình) Nếu dùng DB bên ngoài, đảm bảo host/port truy cập được từ container.

### Mô tả file docker-compose.yml (root)
- service `backend`: build từ `docker/backend.Dockerfile`, port 4000, volume `backend_data` để lưu dữ liệu (ví dụ SQLite).
- service `frontend`: build từ `docker/frontend.Dockerfile`, port 3000, phụ thuộc backend.
- Biến môi trường cơ bản được cấu hình trong `docker-compose.yml`:
  - Frontend: REACT_APP_API_URL=http://backend:4000 (khi chạy trong network của compose, frontend có thể gọi `http://backend:4000`)
  - Backend: DATABASE_URL="/app/data/db.sqlite" (nếu dùng SQLite file)

### IMPORTANT — Port availability (Ghi chú quan trọng)
- Docker compose trong project map các cổng 3000 (frontend) và 4000 (backend) ra host. Vì vậy, trước khi chạy bằng Docker, đảm bảo hai port này đang "available" (chưa bị chương trình khác sử dụng) trên máy host.
- Nếu bạn muốn dùng port khác (ví dụ host đã dùng 3000 hoặc 4000), hãy:
  - Thay đổi mapping port trong `docker-compose.yml` (ví dụ `- "8080:3000"` để map frontend tới host 8080).
  - Và/hoặc cập nhật biến môi trường tương ứng:
    - `frontend/.env` (REACT_APP_API_URL) nếu frontend cần gọi backend trên host khác.
    - `backend/.env` (PORT) nếu backend chạy trên port khác bên trong container.
- Lưu ý: với Create React App, biến REACT_APP_* được nhúng khi build. Nếu frontend đã được build vào image, thay đổi biến môi trường sau khi build sẽ không có hiệu lực. Để thay đổi endpoint runtime trong dev, chạy CRA bằng `npm start` trong container hoặc rebuild image.

### Cấu hình tùy biến
- Nếu muốn truyền biến từ file `.env`, tạo file `.env` ở root hoặc chỉnh `docker-compose.yml` để tham chiếu.
- Nếu muốn frontend gọi backend bằng `localhost` từ trình duyệt, giữ REACT_APP_API_URL là `http://localhost:4000` (điều này khác với cấu hình nội bộ compose). Khi frontend chạy trong container, sử dụng `http://backend:4000`. Khi truy cập từ trình duyệt tới `http://localhost:3000`, frontend cần gọi `http://localhost:4000`; để giải quyết có thể:
  - Thay REACT_APP_API_URL trong `docker-compose.yml` thành `http://localhost:4000` (khi muốn fetch từ browser).
  - Hoặc cấu hình reverse-proxy / network phù hợp.

### Chạy stack (development)
Tại root của repo:

```bash
# build image và chạy container trong background
docker compose up --build -d
# xem logs
docker compose logs -f
```

### Dừng và xoá
```bash
# dừng và xoá container (không xoá volume)
docker compose down

# dừng, xoá container và volume (xóa dữ liệu SQLite)
docker compose down -v
```

### Truy cập dịch vụ
- Frontend (trình duyệt): http://localhost:3000
- Backend API: http://localhost:4000

### Dữ liệu bền vững
- `backend_data` volume được định nghĩa trong `docker-compose.yml` giữ file SQLite (nếu backend dùng SQLite). Để backup/restore volume, dùng `docker cp` hoặc mount volume tới host path nếu muốn.

### Gợi ý khi gặp lỗi
- Nếu frontend không gọi được API: kiểm tra giá trị REACT_APP_API_URL trong container / build (ENV được đóng cứng vào build của CRA).
  - Ghi chú: với CRA, biến REACT_APP_* được nhúng khi build; thay đổi env sau khi image đã build sẽ không có hiệu lực nếu frontend đã build sẵn. Trong development có thể chạy CRA bằng `npm start` trong container để đọc env runtime.
- Nếu backend không khởi động: xem logs `docker compose logs backend` và kiểm tra quyền ghi tới volume.

### Lệnh hữu ích (Docker)
```bash
# xem container đang chạy
docker compose ps

# xem logs của backend
docker compose logs -f backend

# mở shell vào container backend
docker compose exec backend sh
# hoặc bash nếu có
docker compose exec backend bash
```

