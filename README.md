# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking daily attendance.

**Developed by:** Santosh Kumar  
**College:** KR Mangalam University

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Live Demo

- **Frontend:** [https://hrms-lite.vercel.app](https://hrms-lite.vercel.app)
- **Backend API:** [https://hrms-lite-api-rl5y.onrender.com](https://hrms-lite-api-rl5y.onrender.com)

## Features

- **Employee Management** - Add, view, and delete employees
- **Attendance Tracking** - Mark daily attendance (Present/Absent)
- **Dashboard** - Overview with statistics and summaries
- **Date Filtering** - View attendance by specific dates
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite (sql.js) |
| Styling | Tailwind CSS |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hackercoder55/HRMS-lite.git
   cd HRMS-lite
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running Locally

1. **Start the backend server** (from `server` folder)
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

2. **Start the frontend** (from `client` folder, in a new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open your browser** and go to `http://localhost:5173`

## API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List all records (with filters) |
| GET | `/api/attendance/employee/:id` | Get employee's attendance |
| GET | `/api/attendance/stats` | Dashboard statistics |
| POST | `/api/attendance` | Mark attendance |

## Project Structure

```
hrms-lite/
├── server/                 # Backend
│   ├── db/
│   │   └── database.js     # SQLite setup
│   ├── routes/
│   │   ├── employees.js    # Employee endpoints
│   │   └── attendance.js   # Attendance endpoints
│   ├── middleware/
│   │   └── validation.js   # Request validation
│   └── server.js           # Express app
│
├── client/                 # Frontend
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app
│   │   └── index.css       # Styles
│   └── index.html
│
└── README.md
```

## Assumptions & Limitations

- Single admin user (no authentication)
- SQLite database (not suitable for high concurrency)
- Data persists in memory for deployed version
- No pagination (suitable for small datasets)

## Author

**Santosh Kumar**  
KR Mangalam University

## License

MIT License - feel free to use for any purpose.
