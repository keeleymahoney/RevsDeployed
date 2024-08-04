-- Creating Employees Table
CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    manager BOOLEAN,
    employee_name TEXT,
    pswd TEXT
);

-- Appending Employees
INSERT INTO Employee (manager, employee_name, pswd)
VALUES
-- ID, Manager (1=T|0=F), Name
(TRUE, 'Joanne Liu', '0000'), 
(TRUE, 'Brandon Cisneros', '0000'), 
(TRUE, 'Keeley Mahoney', '0000'), 
(TRUE, 'Vitoria Cicalese', '0000'), 
(TRUE, 'Alyan Tharani', '0000'), 
(FALSE, 'Aiden Cisneros', '0000'), 
(FALSE, 'Mia Zhang', '0000'), 
(FALSE, 'Lucas Martins', '0000'), 
(FALSE, 'Sofia Patel', '0000'), 
(FALSE, 'Ethan Watanabe', '0000'), 
(FALSE, 'Olivia Smith', '0000'), 
(FALSE, 'Noah Kim', '0000'), 
(FALSE, 'Isabella Johnson', '0000'), 
(FALSE, 'Liam Tan', '0000'), 
(FALSE, 'Emma Garcia', '0000'),
(FALSE, 'KITCHEN', '0000'),
(FALSE, 'MENUBOARD', '0000');
