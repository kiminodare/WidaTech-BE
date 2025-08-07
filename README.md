# 🧾 WidaTech Backend (NestJS)

Backend service untuk aplikasi WidaTech, dibangun menggunakan [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), dan PostgreSQL.

## 🚀 Getting Started

### ✅ Prerequisites

- [PNPM](https://pnpm.io/) (disarankan)
- [Node.js](https://nodejs.org/) (disarankan)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Setup & Jalankan Backend

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm start:dev
```

> ⚙️ Pastikan file `.env` sudah dibuat dan mengarah ke database PostgreSQL.  
> 💡 Aplikasi akan berjalan di `http://localhost:8999` (atau sesuai dengan port yang diatur di file `.env`).

Contoh `.env`:
```
DATABASE_URL="postgresql://widatech_user:widatech_pass@localhost:5432/widatech_test?schema=public"
PORT=8999
```

---

## ✨ Features

- 🔍 Autocomplete produk saat membuat invoice (nama, gambar, harga, stok)
- 📦 Lihat daftar invoice (dengan pagination/lazy loading)
- 📊 Grafik revenue (harian, mingguan, bulanan), dengan pan & zoom

---

## 🛠 Tech Stack

- **Framework:** NestJS (Express)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Runtime:** PNPM

---

## 👨‍💻 Author

**Kiminodare**  
Fullstack Engineer
