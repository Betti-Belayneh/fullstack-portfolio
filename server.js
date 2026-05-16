/**
 * Author: Betelehem Belayneh
 * server.js
 * Express server for Student & Job Application Tracker
 */

const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Database connection pool — reads credentials from environment variables.
// Never commit real credentials to git.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "zerihunb_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/* ---------------------------
   HEALTH CHECK
---------------------------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

/* ---------------------------
   GET ASSIGNMENTS
---------------------------- */
app.get("/assignments", (req, res) => {
  const sql = `
    SELECT a.title, a.due_date, a.status, c.course_name
    FROM assignment a
    JOIN course c ON a.course_id = c.course_id
    ORDER BY a.due_date
  `;

  pool.query(sql, (err, rows) => {
    if (err) {
      console.error("GET /assignments failed:", err.message);
      return res.status(500).json({ error: "Failed to fetch assignments" });
    }
    res.json(rows);
  });
});

/* ---------------------------
   GET APPLICATIONS
---------------------------- */
app.get("/applications", (req, res) => {
  const sql = `
    SELECT a.position, a.status, a.applied_date, c.company_name
    FROM application a
    JOIN company c ON a.company_id = c.company_id
    ORDER BY a.applied_date DESC
  `;

  pool.query(sql, (err, rows) => {
    if (err) {
      console.error("GET /applications failed:", err.message);
      return res.status(500).json({ error: "Failed to fetch applications" });
    }
    res.json(rows);
  });
});

/* ---------------------------
   ADD ASSIGNMENT
---------------------------- */
app.post("/assignment", (req, res) => {
  const { course_id, title, due_date, status } = req.body;

  if (!course_id || !title || !due_date || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  pool.query(
    "INSERT INTO assignment (course_id, title, due_date, status) VALUES (?, ?, ?, ?)",
    [course_id, title, due_date, status],
    (err) => {
      if (err) {
        console.error("POST /assignment failed:", err.message);
        return res.status(500).json({ error: "Insert failed" });
      }
      res.json({ success: true });
    }
  );
});

/* ---------------------------
   ADD APPLICATION
   - Checks if company already exists
   - Creates it if not
   - Then inserts the application linked to that company
---------------------------- */
app.post("/application", (req, res) => {
  const { company_name, position, status, applied_date } = req.body;

  if (!company_name || !position || !status || !applied_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const trimmedName = company_name.trim();

  pool.query(
    "SELECT company_id FROM company WHERE company_name = ?",
    [trimmedName],
    (err, rows) => {
      if (err) {
        console.error("Company lookup failed:", err.message);
        return res.status(500).json({ error: "DB error" });
      }

      if (rows.length === 0) {
        // Company doesn't exist — insert it first
        pool.query(
          "INSERT INTO company (company_name) VALUES (?)",
          [trimmedName],
          (err2, result) => {
            if (err2) {
              console.error("Company insert failed:", err2.message);
              return res.status(500).json({ error: "Insert company failed" });
            }
            insertApplication(result.insertId);
          }
        );
      } else {
        insertApplication(rows[0].company_id);
      }

      function insertApplication(company_id) {
        pool.query(
          `INSERT INTO application
           (company_id, position, status, applied_date)
           VALUES (?, ?, ?, ?)`,
          [company_id, position, status, applied_date],
          (err3) => {
            if (err3) {
              console.error("Application insert failed:", err3.message);
              return res.status(500).json({ error: "Insert application failed" });
            }
            res.json({ success: true });
          }
        );
      }
    }
  );
});

/* ---------------------------
   START SERVER
   - Uses PORT from environment (required by hosting platforms like Railway)
---------------------------- */
const PORT = process.env.PORT || 5070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});