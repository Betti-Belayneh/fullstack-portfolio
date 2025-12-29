/**
 * Author: Betelehem Belayneh
 * tracker.js
 * Client-side logic (adapted to existing HTML structure)
 */

$(document).ready(function () {

  /* ---------------------------
     ADD SCHOOL ASSIGNMENT
  ---------------------------- */
  $("#assignmentForm").on("submit", function (e) {
    e.preventDefault();

    $.post("/assignment", {
      // school.html uses "Course ID" (with space)
      course_id: $("#Course\\ ID").val(),
      title: $("#title").val(),
      due_date: $("#due_date").val(),
      status: $("#status").val()
    })
    .done(function () {
      // Redirect back to home page
      window.location.href = "/";
    })
    .fail(function (err) {
      alert("Failed to add assignment.");
      console.error(err);
    });
  });

  /* ---------------------------
     ADD JOB APPLICATION
  ---------------------------- */
  $("#jobForm").on("submit", function (e) {
    e.preventDefault();

    $.post("/application", {
      // jobs.html uses id="name" for company
      company_name: $("#name").val(),
      position: $("#position").val(),
      status: $("#job_status").val(),
      applied_date: $("#applied_date").val()
    })
    .done(function () {
      window.location.href = "/";
    })
    .fail(function (err) {
      alert("Failed to add application.");
      console.error(err);
    });
  });

  /* ---------------------------
     LOAD ASSIGNMENTS (ALL PAGES)
  ---------------------------- */
  if ($("#assignmentTable").length || $("#homeAssignmentTable").length) {
    $.getJSON("/assignments", function (data) {
      let html = `
        <tr>
          <th>Course</th>
          <th>Title</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>`;

      data.forEach(a => {
        html += `
          <tr class="${a.status.toLowerCase()}">
            <td>${a.course_name}</td>
            <td>${a.title}</td>
            <td>${a.due_date}</td>
            <td>${a.status}</td>
          </tr>`;
      });

      $("#assignmentTable, #homeAssignmentTable").html(html);
    });
  }

  /* ---------------------------
     LOAD JOB APPLICATIONS
  ---------------------------- */
  if ($("#jobTable").length || $("#homeJobTable").length) {
    $.getJSON("/applications", function (data) {
      let html = `
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Status</th>
          <th>Applied Date</th>
        </tr>`;

      data.forEach(j => {
        html += `
          <tr>
            <td>${j.company_name}</td>
            <td>${j.position}</td>
            <td>${j.status}</td>
            <td>${j.applied_date}</td>
          </tr>`;
      });

      $("#jobTable, #homeJobTable").html(html);
    });
  }

});
