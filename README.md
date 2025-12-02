---

# 🎬 Movie App — Frontend

A responsive movie management application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **React Hook Form + Zod** for validation.
Users can log in, create movies, update movies, upload posters, and view paginated movie lists.

---

## 🚀 Features

### ✅ Authentication

* Login with email & password
* “Remember Me” option using **localStorage**
* Session-based authentication using **sessionStorage**
* Auto-redirect if already logged in

### 🎥 Movie Management

* Create new movie
* Update existing movie
* Upload movie poster (image) using **react-dropzone**
* Client-side form validation using **Zod + React Hook Form**
* Pagination (8 movies per page)

### 📱 Responsive UI

* Fully responsive (mobile → desktop)
* Clean grid layout for movie cards
* Custom reusable UI components

---

## 🛠️ Tech Stack

| Technology                   | Purpose            |
| ---------------------------- | ------------------ |
| **Next.js 13+ (App Router)** | UI + Routing       |
| **Typescript**               | Type-safety        |
| **Tailwind CSS**             | Styling            |
| **React Hook Form**          | Form management    |
| **Zod**                      | Schema validations |
| **React Dropzone**           | File uploading     |
| **Axios / Fetch**            | API calls          |

---

## ⚙️ Environment Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/amanofficial321/MoviesAppFE.git
cd MoviesAppFE
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_STATIC_ASSETS_URL=http://localhost:5000
```

### 4️⃣ Run the development server

```bash
npm run dev
```

