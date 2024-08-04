-- Creates Customer Order Details junction table that tracks actual food items associated with order
CREATE TABLE Customer_Customizations(
    id SERIAL PRIMARY KEY,
    order_detail_id INT,
    ingredient TEXT,
    quantity_change INT,
    FOREIGN KEY (order_detail_id) REFERENCES Customer_Order_Details(id)
);
