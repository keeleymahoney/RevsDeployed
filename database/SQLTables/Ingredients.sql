-- Created Ingredients table
CREATE TABLE Ingredients (
    ingredient_name text PRIMARY KEY,
    -- Quantity before: at the start of the week
    quantity_warning int,
    quantity int,
    -- Unit for quantity, individual or servings
    unit text,
    exp_date date,
    -- Storage location: Pantry, Fridge, or Freezer; Storage for utensils, Sauce for condiments
    storage_location text,
    -- Vegetarian?
    vegetarian boolean,
    -- gluten free?
    glutenfree boolean,
    -- customizable
    customizable boolean
);
-- Adding entries
INSERT INTO Ingredients (ingredient_name, quantity_warning, quantity, unit, exp_date, storage_location, vegetarian, glutenfree, customizable)

VALUES
('Burger Buns', 50, 310, 'Individual', '2024-03-02', 'Pantry', TRUE, FALSE, FALSE),
('Sandwich Bread', 50, 223, 'Individual', '2024-03-14', 'Pantry', TRUE, FALSE, FALSE),
('Burger Patties', 50, 530, 'Individual', '2024-03-24', 'Fridge', FALSE, FALSE, FALSE),
('Chicken Patties - Fried', 50, 843, 'Individual', '2024-03-24', 'Fridge', FALSE, FALSE, FALSE),
('Chicken Patties - Spicy Fried', 50, 279, 'Individual', '2024-03-24', 'Fridge', FALSE, FALSE, FALSE),
('Chicken Patties - Grilled', 50, 210, 'Individual', '2024-03-26', 'Fridge', FALSE, TRUE, FALSE),
('Chicken Tenders', 50, 102, 'Servings', '2024-03-16', 'Fridge', FALSE, FALSE, FALSE),
('Bacon', 50, 965, 'Servings', '2024-04-13', 'Fridge', FALSE, TRUE, TRUE),
('Black Bean Patties', 50, 602, 'Servings', '2024-03-16', 'Fridge', TRUE, TRUE, FALSE),
('Fish Patties', 50, 512, 'Servings', '2024-03-16', 'Fridge', FALSE, FALSE, FALSE),
('Hot Dogs', 50, 265, 'Individual', '2024-04-13', 'Fridge', FALSE, FALSE, FALSE),
('Hot Dog Buns', 50, 108, 'Individual', '2024-03-09', 'Pantry', TRUE, FALSE, FALSE),
('Tortillas', 50, 243, 'Individual', '2024-03-09', 'Pantry', TRUE, FALSE, FALSE),
('Corn Dogs', 50, 310, 'Individual', '2024-05-09', 'Freezer', FALSE, FALSE, FALSE),
('Fries', 50, 108, 'Servings', '2024-04-13', 'Freezer', TRUE, FALSE, FALSE),
('Cheese - American', 50, 958, 'Indivudal', '2024-03-30', 'Fridge', TRUE, TRUE, TRUE),
('Cheese - Pepper Jack', 50, 741, 'Individual', '2024-03-30', 'Fridge', TRUE, TRUE, TRUE),
('Cheese - Swiss', 50, 923, 'Individual', '2024-03-30', 'Fridge', TRUE, TRUE, TRUE),
('Lettuce', 50, 2281, 'Servings', '2024-03-20', 'Fridge', TRUE, TRUE, TRUE),
('Tomatoes', 50, 292, 'Servings', '2024-03-20', 'Fridge', TRUE, TRUE, TRUE),
('Onions', 50, 331, 'Servings', '2024-03-20', 'Fridge', TRUE, TRUE, TRUE),
('Pickles', 50, 530, 'Servings', '2024-03-20', 'Fridge', TRUE, TRUE, TRUE),
('Avocado', 50, 530, 'Servings', '2024-03-20', 'Fridge', TRUE, TRUE, TRUE),
('Ketchup Packets', 50, 912, 'Individual', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Mustard Packets', 50, 912, 'Individual', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Relish', 50, 912, 'Individual', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Gig Em Sauce', 50, 402, 'Servings', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Ranch', 50, 402, 'Servings', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Buffalo Sauce', 50, 402, 'Servings', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Tartar Sauce', 50, 102, 'Servings', '2025-01-01', 'Sauce', TRUE, TRUE, TRUE),
('Salad Bowls - Chicken Caesar', 50, 412, 'Individual', '2024-03-16', 'Storage', TRUE, TRUE, FALSE),
('Tuna Salad', 50, 712, 'Servings', '2024-08-16', 'Fridge', FALSE, TRUE, FALSE),


('Cookies - Chocolate Chip', 50, 850, 'Count', '2024-05-21', 'Freezer', TRUE, FALSE, TRUE),
('Cookies - Sugar', 50, 850, 'Count', '2024-05-21', 'Freezer', TRUE, FALSE, TRUE),
('Ice Cream - Vanilla', 50, 652, 'Servings', '2024-05-11', 'Freezer', TRUE, TRUE, TRUE),
('Ice Cream - Strawberry', 50, 580, 'Servings', '2024-05-11', 'Freezer', TRUE, TRUE, TRUE),
('Ice Cream - Chocolate', 50, 720, 'Servings', '2024-05-11', 'Freezer', TRUE, TRUE, TRUE),
('Ice Cream - Oreo Cookie', 50, 733, 'Servings', '2024-05-11', 'Freezer', TRUE, FALSE, TRUE),
('Napkins', 50, 1310, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Bowls - Entrees', 50, 142, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Bowls - Ice Cream', 50, 1420, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Forks', 50, 4051, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Spoons', 50, 3051, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Straws', 50, 3051, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Cups - Drinks', 50, 1050, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),
('Cups - Milkshake', 50, 1030, 'Individual', '2040-01-01', 'Storage', TRUE, TRUE, FALSE),

('Water Bottles - Aquafina 16-oz', 50, 1243, 'Individual', '2025-01-31', 'Pantry', TRUE, TRUE, FALSE),
('Water Bottles - Aquafina 20-oz', 50, 2123, 'Individual', '2025-01-31', 'Pantry', TRUE, TRUE, FALSE),
('Root Beer', 50, 2430, 'Individual', '2025-01-31', 'Pantry', TRUE, TRUE, FALSE),
('Milk', 50, 540, 'Individual', '2024-04-17', 'Pantry', TRUE, TRUE, FALSE);