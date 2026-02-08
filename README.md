# HRMS Lite

HRMS Lite is a simple and clean **Human Resource Management System** built to manage employees and track daily attendance without unnecessary complexity. This project was created as an academic and practical exercise to understand full‑stack development, real‑world CRUD flows, and deployment on modern platforms.

The goal was to build something that *actually works end‑to‑end* — from adding an employee to marking attendance and seeing live stats on a dashboard.

---

## 👨‍💻 Project Details

* **Developer:** Santosh Kumar
* **Roll Number:** 2301010205
* **University:** KR Mangalam University
* **Project Type:** Academic / Portfolio Project

---

## 🌐 Live Preview

* **Frontend (Vercel):** [https://hrms-lite-flame.vercel.app](https://hrms-lite-flame.vercel.app)
* **Backend API (Render):** [https://hrms-lite-api-rl5y.onrender.com](https://hrms-lite-api-rl5y.onrender.com)

> ℹ️ Note: The backend is hosted on Render (free tier), so the first request may take a few seconds to wake up.

---

## ✨ Features

* **Employee Management**
  Add, view, and remove employee records easily.

* **Attendance Management**
  Mark employees as Present or Absent for a selected date.

* **Dashboard Overview**
  Live summary showing total employees, today’s attendance, and recent activity.

* **Department-wise Organization**
  Employees are grouped into departments like Engineering, HR, Marketing, etc.

* **Clean & Responsive UI**
  Works smoothly on desktop and mobile screens.

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS        |
| Backend  | Node.js, Express                    |
| Database | SQLite (via sql.js)                 |
| Hosting  | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
HRMS-lite/
├── server/                 # Backend
│   ├── db/                 # SQLite setup
│   ├── routes/             # API routes
│   ├── middleware/         # Validation & helpers
│   └── server.js           # Express server entry
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/             # API calls
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Dashboard, Employees, Attendance
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

---

## 🚀 Running the Project Locally

### Prerequisites

* Node.js (v18 or higher)
* npm (or yarn)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Hackercoder55/HRMS-lite.git
cd HRMS-lite
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend will start at:

```
http://localhost:5000
```

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Employees

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /api/employees     | Get all employees  |
| GET    | /api/employees/:id | Get employee by ID |
| POST   | /api/employees     | Add new employee   |
| DELETE | /api/employees/:id | Remove employee    |

### Attendance

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | /api/attendance              | Get attendance records |
| GET    | /api/attendance/employee/:id | Employee attendance    |
| GET    | /api/attendance/stats        | Dashboard stats        |
| POST   | /api/attendance              | Mark attendance        |

---

## 🌍 Deployment Guide

### Backend Deployment (Render)

1. Login to **Render** and create a new **Web Service**
2. Connect GitHub repo: `Hackercoder55/HRMS-lite`
3. Set **Root Directory** to `server`
4. Build Command:

   ```
   npm install
   ```
5. Start Command:

   ```
   node server.js
   ```
6. Add Environment Variable:

   ```
   FRONTEND_URL=https://hrms-lite-flame.vercel.app
   ```

---

### Frontend Deployment (Vercel)

1. Login to **Vercel** and import the repository
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add Environment Variable:

   ```
   VITE_API_URL=https://hrms-lite-api-rl5y.onrender.com/api
   ```
5. Deploy 🎉

6. Dashboard:
7. <img width="1918" height="932" alt="image" src="https://github.com/user-attachments/assets/edf573d1-600a-4259-9559-8bddfc7d52a8" />
8. Employee Dashboard:
9. <img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/c0e6d1c3-db99-4c15-aac6-adda2045e885" />
10. Add Employee:
11. <img width="540" height="579" alt="image" src="https://github.com/user-attachments/assets/209d7eae-06b2-4e55-be7b-bec3ebdb6c96" />
12. Mark Attendance:
13. <img width="1910" height="922" alt="image" src="https://github.com/user-attachments/assets/462d5796-be1e-444f-b440-f43c83a12c29" />
14. Check Dashboard:
15. <img width="1914" height="934" alt="image" src="https://github.com/user-attachments/assets/d3fa7452-2bbd-4b8d-a77c-1591e4ac339b" />





---

## ⚠️ Assumptions & Limitations

* Single admin user (no authentication)
* SQLite database (not designed for heavy concurrency)
* Suitable for small teams and academic use
* No pagination or role-based access

---

## 📜 License & Copyright

MIT License

© 2026 **Santosh Kumar**
Roll No: **2301010205**
KR Mangalam University

You are free to use, modify, and distribute this project for learning and non‑commercial purposes.

---

If you’re reviewing this project — thank you for your time 🙏
