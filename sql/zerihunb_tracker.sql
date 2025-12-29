
-- Author: Betelehem Belayneh
-- Database schema for tracker application

CREATE DATABASE zerihunb_tracker;
USE zerihunb_tracker;

CREATE TABLE course (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(128)
);

CREATE TABLE assignment (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  title VARCHAR(255),
  due_date DATE,
  status VARCHAR(32),
  FOREIGN KEY (course_id) REFERENCES course(course_id)
);

CREATE TABLE company (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(128)
);

CREATE TABLE application (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT,
  position VARCHAR(128),
  status VARCHAR(64),
  applied_date DATE,
  FOREIGN KEY (company_id) REFERENCES company(company_id)
);

INSERT INTO course(course_name) VALUES ("Web Development"), ("Databases");
INSERT INTO company(company_name) VALUES ("Google"), ("IBM");
