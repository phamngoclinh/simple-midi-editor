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
- (Nếu cần) Cơ sở dữ liệu: Postgres/MySQL/SQLite hoặc Docker

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

Mở frontend: `http://localhost:3000` — frontend gọi API `REACT_APP_API_URL` (ví dụ `http://localhost:4000/api`).

## Biến môi trường mẫu

Frontend (`frontend/.env.example`):

```env
REACT_APP_API_URL=http://localhost:4000/api
# thêm biến khác bắt đầu bằng REACT_APP_
```

Backend (`backend/.env.example`):

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=changeme
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
