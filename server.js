/**
 * Author: Betelehem Belayneh
 * server.js
 * Express server for Student & Job Tracker
 */

console.log("server.js loaded");

const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbConfig = {
  host: "127.0.0.1",
  user: "demo",
  password: "$311de999",
  database: "zerihunb_tracker"
};

/* ---------------------------
   GET ASSIGNMENTS
---------------------------- */
app.get("/assignments", function (req, res) {
  const conn = mysql.createConnection(dbConfig);

  const sql = `
    SELECT a.title, a.due_date, a.status, c.course_name
    FROM assignment a
    JOIN course c ON a.course_id = c.course_id
    ORDER BY a.due_date
  `;

  conn.query(sql, function (err, rows) {
    if (err) {
      console.error(err);
      res.status(500).json([]);
    } else {
      res.json(rows);
    }
    conn.end();
  });
});

/* ---------------------------
   GET APPLICATIONS
---------------------------- */
app.get("/applications", function (req, res) {
  const conn = mysql.createConnection(dbConfig);

  const sql = `
    SELECT a.position, a.status, a.applied_date, c.company_name
    FROM application a
    JOIN company c ON a.company_id = c.company_id
    ORDER BY a.applied_date DESC
  `;

  conn.query(sql, function (err, rows) {
    if (err) {
      console.error(err);
      res.status(500).json([]);
    } else {
      res.json(rows);
    }
    conn.end();
  });
});

/* ---------------------------
   ADD ASSIGNMENT
---------------------------- */
app.post("/assignment", function (req, res) {
  const { course_id, title, due_date, status } = req.body;
  const conn = mysql.createConnection(dbConfig);

  conn.query(
    "INSERT INTO assignment (course_id, title, due_date, status) VALUES (?, ?, ?, ?)",
    [course_id, title, due_date, status],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Insert failed" });
      } else {
        res.json({ success: true });
      }
      conn.end();
    }
  );
});

/* ---------------------------
   ADD APPLICATION
---------------------------- */
app.post("/application", function (req, res) {
  const { company_name, position, status, applied_date } = req.body;
  const conn = mysql.createConnection(dbConfig);

  // 1. Check if company exists
  conn.query(
    "SELECT company_id FROM company WHERE company_name = ?",
    [company_name.trim()],
    function (err, rows) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
        conn.end();
        return;
      }

      // 2. If company does NOT exist → insert it
      if (rows.length === 0) {
        conn.query(
          "INSERT INTO company (company_name) VALUES (?)",
          [company_name.trim()],
          function (err2, result) {
            if (err2) {
              console.error(err2);
              res.status(500).json({ error: "Insert company failed" });
              conn.end();
              return;
            }

            insertApplication(result.insertId);
          }
        );
      } else {
        insertApplication(rows[0].company_id);
      }

      // 3. Insert application
      function insertApplication(company_id) {
        conn.query(
          `INSERT INTO application
           (company_id, position, status, applied_date)
           VALUES (?, ?, ?, ?)`,
          [company_id, position, status, applied_date],
          function (err3) {
            if (err3) {
              console.error(err3);
              res.status(500).json({ error: "Insert application failed" });
            } else {
              res.json({ success: true });
            }
            conn.end();
          }
        );
      }
    }
  );
});

/* ---------------------------
   START SERVER
---------------------------- */
const PORT = 5070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {}, 1000); // keep event loop alive

