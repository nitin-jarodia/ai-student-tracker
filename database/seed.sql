-- seed.sql - Sample Data for Testing
-- Run AFTER schema.sql

-- Sample Users
INSERT INTO users (email, full_name, password, role) VALUES
('admin@school.com',    'Admin User',   'hashed_pass', 'admin'),
('teacher1@school.com', 'Priya Sharma', 'hashed_pass', 'teacher'),
('teacher2@school.com', 'Rahul Mehta',  'hashed_pass', 'teacher');

-- Sample Students
INSERT INTO students (name, email, roll_number, class_name, section, parent_name, parent_phone) VALUES
('Aarav Patel',  'aarav@email.com',  'R001', '10', 'A', 'Raj Patel',    '9876543210'),
('Priya Shah',   'priya@email.com',  'R002', '10', 'A', 'Meena Shah',   '9876543211'),
('Rohan Joshi',  'rohan@email.com',  'R003', '10', 'A', 'Suresh Joshi', '9876543212'),
('Ananya Gupta', 'ananya@email.com', 'R004', '10', 'B', 'Vikram Gupta', '9876543213'),
('Dev Desai',    'dev@email.com',    'R005', '10', 'B', 'Hina Desai',   '9876543214');

-- Sample Subjects
INSERT INTO subjects (name, code, class_name, teacher_id) VALUES
('Mathematics',      'MATH10', '10', 2),
('Science',          'SCI10',  '10', 2),
('English',          'ENG10',  '10', 3),
('Social Studies',   'SST10',  '10', 3),
('Computer Science', 'CS10',   '10', 2);

-- Sample Performance (Aarav - Good, Priya - Average, Dev - At Risk)
INSERT INTO performance (student_id, subject_id, score, max_score, exam_type, exam_date) VALUES
(1, 1, 85, 100, 'unit_test', '2025-01-15'),
(1, 2, 78, 100, 'unit_test', '2025-01-15'),
(1, 3, 92, 100, 'unit_test', '2025-01-15'),
(1, 4, 88, 100, 'unit_test', '2025-01-15'),
(1, 5, 95, 100, 'unit_test', '2025-01-15'),
(2, 1, 55, 100, 'unit_test', '2025-01-15'),
(2, 2, 60, 100, 'unit_test', '2025-01-15'),
(2, 3, 65, 100, 'unit_test', '2025-01-15'),
(2, 4, 58, 100, 'unit_test', '2025-01-15'),
(2, 5, 62, 100, 'unit_test', '2025-01-15'),
(5, 1, 32, 100, 'unit_test', '2025-01-15'),
(5, 2, 28, 100, 'unit_test', '2025-01-15'),
(5, 3, 40, 100, 'unit_test', '2025-01-15'),
(5, 4, 35, 100, 'unit_test', '2025-01-15'),
(5, 5, 30, 100, 'unit_test', '2025-01-15');

-- Sample Attendance
INSERT INTO attendance (student_id, date, status) VALUES
(1, '2025-01-13', 'present'),
(1, '2025-01-14', 'present'),
(1, '2025-01-15', 'present'),
(2, '2025-01-13', 'present'),
(2, '2025-01-14', 'absent'),
(2, '2025-01-15', 'present'),
(5, '2025-01-13', 'absent'),
(5, '2025-01-14', 'absent'),
(5, '2025-01-15', 'present');
