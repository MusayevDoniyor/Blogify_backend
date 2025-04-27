**Blogify**

---

# 📚 Blog Platform Backend - MWP

> Texnologiyalar:  
> **Typescript**, **PostgreSQL**, **pg (client)**, **Express.js**

---

## 📁 Project Structure

```
src/
├── config/
│   └── db.ts                # PostgreSQL connection (pg library bilan)
│
├── middlewares/
│   ├── auth.middleware.ts   # Tokenni tekshiradi
│   └── error.middleware.ts  # Xatolarni ushlab beradi
│
├── modules/
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.sql.ts
│   │
│   ├── blogs/
│   │   ├── blog.routes.ts
│   │   ├── blog.controller.ts
│   │   ├── blog.service.ts
│   │   └── blog.sql.ts
│   │
│   ├── posts/
│   │   ├── post.routes.ts
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   └── post.sql.ts
│   │
│   └── comments/
│       ├── comment.routes.ts
│       ├── comment.controller.ts
│       ├── comment.service.ts
│       └── comment.sql.ts
│
├── utils/
│   ├── jwt.ts                # JWT token yaratish, verify qilish
│   └── hash.ts               # Password hash va compare
│
├── types/
│   └── (custom types)
│
├── app.ts                    # Express App setup
├── server.ts                 # Server run qismi
├── .env                      # Environment variables
├── tsconfig.json             # TypeScript config
└── package.json              # Project dependencies
```

---

## 🗄️ Database Tables

### users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### blogs

```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### blog_members

```sql
CREATE TABLE blog_members (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### posts

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### comments

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 API Routes

### Users

| Method | Endpoint                   | Description                                        |
| :----- | :------------------------- | :------------------------------------------------- |
| POST   | `/api/v1/users/register`   | Foydalanuvchini ro'yxatdan o'tkazish               |
| POST   | `/api/v1/users/login`      | Login qilish, cookie'ga token beriladi             |
| POST   | `/api/v1/users/getProfile` | User o'z profilini olish, cookie'dan token olinadi |

---

### Blogs

| Method | Endpoint                            | Description                        |
| :----- | :---------------------------------- | :--------------------------------- |
| POST   | `/api/v1/blogs/create`              | Blog yaratish (faqat owner)        |
| GET    | `/api/v1/blogs/get-my-blogs`        | Foydalanuvchi yaratgan bloglar     |
| GET    | `/api/v1/blogs/get-my-joined-blogs` | Foydalanuvchi a'zo bo'lgan bloglar |
| GET    | `/api/v1/blogs/get-blog-info/:id`   | Blog haqida ma'lumot (id bo'yicha) |
| PATCH  | `/api/v1/blogs/update/:id`          | Blogni update qilish (faqat owner) |
| DELETE | `/api/v1/blogs/delete/:id`          | Blogni o'chirish (faqat owner)     |
| GET    | `/api/v1/blogs/search?title=query`  | Bloglarni nomi bo'yicha qidirish   |
| POST   | `/api/v1/blogs/join-blog/:id`       | Blogga a'zo bo'lish                |
| POST   | `/api/v1/blogs/leave-blog/:id`      | Blogdan chiqib ketish              |
| GET    | `/api/v1/blogs/:id/get-users`       | Blog a'zolarini olish              |

---

### Posts

| Method | Endpoint                             | Description                                |
| :----- | :----------------------------------- | :----------------------------------------- |
| POST   | `/api/v1/posts/create`               | Post yaratish (blog owner)                 |
| GET    | `/api/v1/posts/get-all/:blogId`      | Blogga tegishli barcha postlar             |
| GET    | `/api/v1/posts/get-by-id/:postId`    | Postni ko'rish (view_count +1)             |
| PATCH  | `/api/v1/posts/update/:postId`       | Postni update qilish (blog owner)          |
| DELETE | `/api/v1/posts/delete/:postId`       | Postni o'chirish (blog owner)              |
| GET    | `/api/v1/posts/sort-by-date/:blogId` | Blogdagi postlarni sanaga qarab tartiblash |
| GET    | `/api/v1/posts/:postId/get-comments` | Postga yozilgan commentlarni olish         |

---

### Comments

| Method | Endpoint                             | Description             |
| :----- | :----------------------------------- | :---------------------- |
| POST   | `/api/v1/comments/create`            | Comment yozish          |
| PATCH  | `/api/v1/comments/update/:commentId` | Commentni update qilish |
| DELETE | `/api/v1/comments/delete/:commentId` | Commentni o'chirish     |

---

## 🔐 Authentication

- Barcha `private` route'larda **cookie dan token** olinadi.
- Token yordamida foydalanuvchi `id` aniqlanadi.
- Faqat egasiga tegishli post/blog/comment ustida o'zgartirish va o'chirish mumkin.

---

## ⚙️ Ishlash Tartibi

1. User `/register` orqali ro'yxatdan o'tadi.
2. `/login` qiladi va cookie ga JWT token oladi.
3. Foydalanuvchi blog yaratadi yoki mavjud bloglarga qo'shiladi.
4. Blog egasi blog ichida post ochadi.
5. Foydalanuvchilar postlarga comment yozishadi.
6. Har safar post ko'rilganda `view_count` +1 oshadi.

---

# ✅ Yakuniy Eslatmalar:

- CRUD operatsiyalarda har doim **ownership** tekshiriladi.
- `get-by-id` chaqirilganda **post view count** oshiriladi.
- Har bir table orasida **relationship** bor (Foreign key bilan).

---
