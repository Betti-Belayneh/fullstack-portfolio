# Student & Job Application Tracker

A full-stack web application for tracking school assignments and job applications in one place. Built with Node.js, Express, and MySQL, deployed on Railway.

🔗 **Live demo:** https://fullstack-portfolio-production-8f6f.up.railway.app

## What it does

- **School Tracker** — log assignments with course, due date, and status (Pending / Completed / Overdue)
- **Job Tracker** — log job applications with company, position, status (Applied / Interview / Offer / Rejected), and date applied
- **Dashboard** — see both trackers at a glance, color-coded by status
- **Normalized data** — automatically reuses an existing company or creates a new one, and enforces referential integrity between assignments and courses

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Database | MySQL (relational schema with foreign keys, connection pooling) |
| Frontend | HTML, CSS, JavaScript, jQuery |
| API | REST (JSON over HTTP) |
| Deployment | Railway (managed MySQL + Node service) |

## Architecture

```
Browser (HTML + jQuery)
        |  AJAX requests
        v
Express server (server.js)
        |  pooled SQL queries
        v
MySQL database
   ├── course
   ├── assignment   (FK -> course)
   ├── company
   └── application  (FK -> company)
```

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/assignments` | List all assignments with course name |
| POST | `/assignment` | Create a new assignment |
| GET | `/applications` | List all applications with company name |
| POST | `/application` | Create a new application (auto-creates company if new) |
| GET | `/health` | Health check endpoint |

## Running locally

**Prerequisites:** Node.js 18+, a running MySQL instance

```bash
git clone https://github.com/Betti-Belayneh/fullstack-portfolio.git
cd fullstack-portfolio
npm install
```

Load the database schema:

```bash
mysql -u root -p < sql/zerihunb_tracker.sql
```

Create a `.env` file in the project root:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=zerihunb_tracker
PORT=5070
```

Start the server:

```bash
npm start
```

Open http://localhost:5070 in your browser.

## Design decisions

- **Connection pooling** instead of per-request connections, so the app handles concurrent traffic without exhausting database connections.
- **Environment variables** for all credentials — nothing sensitive is committed to the repo.
- **Foreign key constraints** on `assignment.course_id` and `application.company_id` so the database rejects orphaned records rather than silently storing bad data.
- **Dynamic port binding** (`process.env.PORT`) so the same code runs locally and on a hosting platform without changes.

## Why I built this

As a Computer Science student balancing coursework and a job search, I wanted one tool to track both — and I wanted to build it end to end myself rather than use an off-the-shelf app. 
This project covered the full development cycle: 
	srelational schema design, REST API development, frontend–backend integration, environment-based configuration, and cloud deployment with a managed database.

## Author

**Betelehem Belayneh**
[GitHub](https://github.com/Betti-Belayneh) 
[LinkedIn](https://linkedin.com/in/betelehem-zerihun) 
[Portfolio](https://betti-belayneh.github.io/betti-belayneh-portfolio/)