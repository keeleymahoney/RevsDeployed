-- Creating Supplier_Orders Table
CREATE TABLE Supplier_Orders (
    -- OrderNumber attribute is set as the primary key.
    -- Primary Key allows us to combine multiple tables
    order_number INT PRIMARY KEY,
    order_date DATE,
    order_time TIME,
    cost DECIMAL,
    supplier TEXT
);

-- Appending Supplier Orders
INSERT INTO Supplier_Orders (order_number, order_date, order_time, cost, supplier)
VALUES
(2837461, '2023-01-21', '13:00:12', 6452.23, 'Sysco'),
(3726374, '2023-04-20', '08:10:20', 4957.12, 'Sysco'),
(2038461, '2023-05-20', '12:34:04', 6239.59, 'Sysco'),
(2615234, '2023-06-19', '21:02:34', 6803.96, 'Sysco'),
(7029374, '2023-07-19', '18:40:12', 6283.75, 'Sysco'); 