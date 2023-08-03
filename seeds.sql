USE employees_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Manager', 100000.00, 1),
('Salesperson', 70000.00, 1),
('Software Engineer', 120000.00, 2),
('System Architect', 150000.00, 2),
('Finance Manager', 90000.00, 3),
('Accountant', 80000.00, 3),
('Marketing Director', 130000.00, 4),
('Marketing Associate', 75000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Oliver', 'Johnson', 3, NULL),
('Emma', 'Williams', 4, 3),
('Noah', 'Jones', 5, NULL),
('Ava', 'Brown', 6, 5),
('Liam', 'Davis', 7, NULL),
('Sophia', 'Miller', 8, 7),
('Ethan', 'Wilson', 2, 1),
('Isabella', 'Moore', 4, 3),
('Mason', 'Taylor', 6, 5),
('Mia', 'Anderson', 8, 7),
('Lucas', 'Thomas', 1, 1),
('Charlotte', 'Jackson', 3, 3),
('Aiden', 'White', 5, 5),
('Harper', 'Harris', 7, 7),
('Elijah', 'Martin', 2, 1),
('Amelia', 'Thompson', 4, 3),
('James', 'Garcia', 6, 5),
('Benjamin', 'Martinez', 8, 7);
