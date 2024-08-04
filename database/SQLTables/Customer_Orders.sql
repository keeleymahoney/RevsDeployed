-- Creates Customer Orders entity that tracks high level details of a particular order
CREATE TABLE Customer_Orders(
    order_number INT PRIMARY Key,
    total_cost DECIMAL,
    order_time TIME,
    order_date DATE,
    order_status INT,
    notes TEXT
);