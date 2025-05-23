# 🚀 Express + TypeScript + Prisma + PostgreSQL API

This project is a scalable **Express.js** backend built  with **TypeScript**, **Prisma ORM**, and **PostgreSQL**. It includes authentication with **JWT**, **bcrypt** for password hashing, and follows best practices for security and logging using **helmet** and **morgan**.

---

## 🔹 Features
✅ **Express.js** with **TypeScript** for a clean and scalable structure.  
✅ **Prisma ORM** for database management.  
✅ **PostgreSQL** as the database.  
✅ **Authentication** using **JWT** (JSON Web Tokens).  
✅ **Password hashing** with **bcrypt**.  
✅ **Security enhancements** using **helmet**.  
✅ **Request logging** using **morgan**.  

---

## 📌 Setup Instructions

### **1️⃣ Clone the Repository**
```sh
git clone your-repo-url.git
cd your-project
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the project root and add the following:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"
JWT_SECRET="your_secret_key"
PORT=5000
```
🔹 Replace `username`, `password`, and `mydatabase` with your actual PostgreSQL credentials.

### **4️⃣ Create & Migrate the Database**
If the database doesn't exist, create it manually:
```sh
psql -U username -c "CREATE DATABASE mydatabase;"
```
Then, run Prisma migrations:
```sh
npx prisma migrate dev
```
💡 This will create the necessary tables based on `prisma/schema.prisma`.

### **5️⃣ Start the Development Server**
```sh
npm run dev
```
🚀 Your server should now be running on `http://localhost:5000`.

---

## 📌 Project Structure
```
📂 src
 ┣ 📂 controllers    # Route handlers (Auth, User, etc.)
 ┣ 📂 routes         # Express route definitions
 ┣ 📂 middlewares    # Custom middleware (Auth, Logging, etc.)
 ┣ 📂 utils          # Utility functions (Prisma client, JWT helpers, etc.)
 ┣ 📂 types          # TypeScript interfaces & types
 ┣ 📜 server.ts      # Entry point for the server
```

---

## 📌 Additional Commands

### **Run Prisma Studio (Visual Database Management)**
```sh
npx prisma studio
```

### **Reset & Reapply Migrations (Use with Caution!)**
```sh
npx prisma migrate reset
```
⚠️ This will **delete all existing data** and recreate the database.

### **Run Production Build**
```sh
npm run build
npm start
```

---

## 📌 Troubleshooting
❓ **Error: Database connection failed** → Make sure PostgreSQL is running and the `DATABASE_URL` in `.env` is correct.  
❓ **Error: JWT_SECRET not found** → Make sure you created the `.env` file with `JWT_SECRET`.  
❓ **Prisma migration issues** → Try running `npx prisma migrate reset` (WARNING: This deletes data!).

---

## 🎉 Happy Coding!

