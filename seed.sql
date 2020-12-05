INSERT INTO department (department_name)
VALUES ("Sales"), ("Engineering"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), 
("Lead Engineer", 150000, 2), ("Accountant", 125000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Real", "Person", 1), ("Paris", "Hilton", 2), ("Tabe", "Mono", 3);