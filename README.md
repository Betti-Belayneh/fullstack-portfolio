# Student & Job Application Tracker

A full-stack web application that helps students track school assignments and job applications in one place. Built with Node.js, Express, and MySQL.

🔗 **Live demo:** _(deployment link goes here)_

## What it does

- **School Tracker** — log assignments with course, due date, and status (Pending / Completed / Overdue)
- **Job Tracker** — log job applications with company, position, status (Applied / Interview / Offer / Rejected), and date
- **Dashboard** — see both at a glance on the home page, color-coded by status
- **Smart company handling** — automatically reuses existing companies or creates new ones, keeping the database normalized

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Database | MySQL (relational schema with foreign keys) |
| Frontend | HTML, CSS, JavaScript, jQuery |
| API style | REST (JSON over HTTP) |

## Architecture

```
Browser (HTML + jQuery)
        ↓ AJAX
Express server (server.js)
        ↓ SQL queries via connection pool
MySQL database
   ├── course
   ├── assignment   (FK → course)
   ├── company
   └── application  (FK → company)
```

## Running locally

**Prerequisites:** Node.js 18+, MySQL running locally

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Betti-Belayneh/fullstack-portfolio.git
   cd fullstack-portfolio
   npm install
   ```

2. Set up the database:
   ```bash
   mysql -u root -p < sql/zerihunb_tracker.sql
   ```

3. Create a `.env` file in the project root:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=zerihunb_tracker
   PORT=5070
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open http://localhost:5070 in your browser.

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/assignments` | List all assignments with course name |
| POST | `/assignment` | Create a new assignment |
| GET | `/applications` | List all job applications with company name |
| POST | `/application` | Create a new application (auto-creates company if new) |
| GET | `/health` | Health check endpoint |

## Why I built this

As a Computer Science student juggling coursework and a job search, I wanted one place to track both — and I wanted to build it end-to-end myself instead of using off-the-shelf tools. This project let me practice the full development cycle: schema design, REST API development, frontend-backend integration, and deployment.

## Author

**Betelehem Belayneh**
[LinkedIn](https://linkedin.com/in/betelehem-zerihun)
[Portfolio](https://betti-belayneh.github.io/betti-belayneh-portfolio/)