-- Creates Customer Order Details junction table that tracks actual food items associated with order
CREATE TABLE Customer_Order_Details(
    id SERIAL PRIMARY KEY,
    menu_item TEXT,
    order_number INT,
    quantity INT,
    customized BOOLEAN,
    FOREIGN KEY (menu_item) REFERENCES Menu_Items(item_name),
    FOREIGN KEY (order_number) REFERENCES Customer_Orders(order_number)
);
