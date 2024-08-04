/*
Create the table with 
    Item_Name as primary key (which is a text value)
    Price of item which is a decimal
    Menu_Category which is a text value
*/


CREATE TABLE Menu_Items(
    Item_Name TEXT PRIMARY Key,
    Price DECIMAL,
    Menu_Category TEXT,
    Descript TEXT,
    vegetarian BOOLEAN,
    glutenfree BOOLEAN,
    promoted BOOLEAN,
    Picture TEXT    
);

/*
Insert into the newly created table with 
    Item_Name as primary key (which is a text value)
    Price of item which is a decimal
    Menu_Category which is a text value
*/

INSERT INTO Menu_Items (item_name, price, menu_category, descript, vegetarian, glutenfree, promoted, picture)

VALUES

/*
    This is based on the Real menu at Rev's. Each menu item is able to be ordered in real life
    The categories for a menu are entree, dessert, side, and beverage
*/
('Bacon Cheeseburger', 8.29, 'Entree', 'A flame grilled burger topped with bacon.', FALSE, FALSE, FALSE, 'https://i.ibb.co/GtDcfCF/Bacon-Cheese-Burger.png'),
('Classic Hamburger', 6.89, 'Entree', 'A flame grilled burger. As classic as it gets!', FALSE, FALSE, FALSE, 'https://i.ibb.co/Fhyz5FK/Classic-Hamburger.png'),
('Gig Em Patty Melt', 7.59, 'Entree', 'A delicious beef patty melt with loads of cheese.', FALSE, FALSE, FALSE, 'https://i.ibb.co/CmWVpPd/Gig-em-Patty-Melt.png'),
('Cheeseburger', 6.89, 'Entree', 'A flame grilled burger, topped with cheese.', FALSE, FALSE, FALSE, 'https://i.ibb.co/cwmGCXm/Cheese-Burger.png'),
('Black Bean Burger', 7.59, 'Entree', 'A lighter alternative to beef burgers.', FALSE, FALSE, FALSE, 'https://i.ibb.co/NSXWk8n/Black-Bean-Burger.png'),
('Revs Grilled Chicken Sandwich', 8.39, 'Entree', 'A delicious chicken breast sandwich grilled to perfection.', FALSE, FALSE, FALSE, 'https://i.ibb.co/W6Vq4tf/Revs-Grilled-Chicken-Sandwhich.png'),
('Spicy Chicken Sandwich', 8.39, 'Entree', 'A flaming hot chicken sandwich.', FALSE, FALSE, FALSE, 'https://i.ibb.co/xhjzmQ1/Spicy-Chicken-Sandwhich.png'),
('Aggie Chicken Club', 8.39, 'Entree', 'A mouth wateringly hearty chicken sandwich.', FALSE, FALSE, FALSE, 'https://i.ibb.co/GQVnhfC/Aggie-Chicken-Club.png'),
('2 Corn Dogs', 4.99, 'Entree', 'A two corn dog entree. Perfect for adults and kids!', FALSE, FALSE, FALSE, 'https://i.ibb.co/KXD3JJK/2-Corn-Dog-Meal.png'),
('2 Hot Dogs', 4.99, 'Entree', 'A two hot dog entree. Perfect for adults and kids!', FALSE, FALSE, FALSE, 'https://i.ibb.co/dpfnmyX/2-Hot-Dog-Meal.png'),
('3 Chicken Tenders', 4.99, 'Entree', 'A three chicken tender entree. Perfect for adults and kids!', FALSE, FALSE, FALSE, 'https://i.ibb.co/1sXJP8n/3-Tender-Entree.png'),

/*
Separate into two separate menu items instead of combining because cost is different. 2 chicken bacon
ranch wraps does not equal the cost of two 1 chicken bacon ranch wraps
*/
('2 Chicken Bacon Ranch Wraps', 6.00, 'Entree', 'A double order of our classic Chicken Bacon Ranch Wraps', FALSE, FALSE, FALSE, 'https://i.ibb.co/k0ss173/Chicken-Wraps.png'),
('1 Chicken Bacon Ranch Wrap', 3.49, 'Entree', 'A single order of our classic Chicken Bacon Ranch Wraps', FALSE, FALSE, FALSE, 'https://i.ibb.co/k0ss173/Chicken-Wraps.png'),

/*
Separate into two separate menu items instead of combining because cost is different. 2 classic chicken
 wraps does not equal the cost of two 1 classic chicken wraps
*/
('2 Classic Chicken Wraps', 5.00, 'Entree', 'A double order of our classic Chicken Wraps', FALSE, FALSE, FALSE, 'https://i.ibb.co/k0ss173/Chicken-Wraps.png'),
('1 Classic Chicken Wrap', 2.99, 'Entree', 'A single order of our classic Chicken Wraps', FALSE, FALSE, FALSE, 'https://i.ibb.co/k0ss173/Chicken-Wraps.png'),
('Fish Sandwich', 7.99, 'Entree', 'Get a taste for the sea with our Fish Sandwich', FALSE, FALSE, FALSE, 'https://i.ibb.co/gwk2xzp/Fish-Sandwich.png'),
('Tuna Melt', 7.99, 'Entree', 'Get a taste for the sea with our Tuna Melt', FALSE, FALSE, FALSE, 'https://i.ibb.co/zfd06vM/Tuna-Melt.png'),
('Chicken Caesar Salad', 8.29, 'Entree', 'A fresh Caesar salad with grilled chicken.', FALSE, FALSE, FALSE, 'https://i.ibb.co/QC7KTmy/Chicken-Caesar-Salad.png'),
('French Fries', 1.99, 'Side', 'A tasty order of fresh cut, sea salted fries.', FALSE, FALSE, FALSE, 'https://i.ibb.co/wC2NCr0/French-Fries.png'),

('Aggie Shake', 4.49, 'Dessert', 'Complement your meal with a delightful Aggie Shake, with ice cream flavor of your choice', FALSE, FALSE, FALSE, 'https://i.ibb.co/8bWmbgs/Aggie-Shake.png'),

/*Separate into type of shake for easy access*/
('Chocolate Aggie Shake', 4.49, 'Dessert', 'Complement your meal with a delightful Aggie Shake, with Chocolate flavor', FALSE, FALSE, FALSE, 'https://i.ibb.co/8bWmbgs/Aggie-Shake.png'),
('Strawberry Aggie Shake', 4.49, 'Dessert', 'Complement your meal with a delightful Aggie Shake, with Strawberry flavor', FALSE, FALSE, FALSE, 'https://i.ibb.co/8bWmbgs/Aggie-Shake.png'),
('Vanilla Aggie Shake', 4.49, 'Dessert', 'Complement your meal with a delightful Aggie Shake, with Vanilla flavor', FALSE, FALSE, FALSE, 'https://i.ibb.co/8bWmbgs/Aggie-Shake.png'),
('Oreo Cookie Aggie Shake', 4.49, 'Dessert', 'Complement your meal with a delightful Aggie Shake, with Oreo Cookie flavor', FALSE, FALSE, FALSE, 'https://i.ibb.co/8bWmbgs/Aggie-Shake.png'),

('Cookie Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae with cookie and ice cream of your choice', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),

/*Separate into type of shake and type of cookie for easy access*/
('Sugar Cookie Chocolate Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing sugar cookies and chocolate ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Sugar Cookie Strawberry Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing sugar cookies and strawberry ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Sugar Cookie Vanilla Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing sugar cookies and vanilla ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Sugar Cookie Oreo Cookie Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing sugar cookies and oreo cookie flavored ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),

('Chocolate Chip Cookie Chocolate Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing chocolate chip cookies and chocolate ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Chocolate Chip Cookie Strawberry Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing chocolate chip cookies and strawberry ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Chocolate Chip Cookie Vanilla Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing chocolate chip cookies and vanilla ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),
('Chocolate Chip Cookie Oreo Cookie Ice Cream Sundae', 4.69, 'Dessert', 'A tasty sundae containing chocolate chip cookies and oreo cookie flavored ice cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/DDc3NtY/Cookie-Ice-Cream-Sundae.png'),

('Double Scoop Ice Cream', 3.29, 'Dessert', 'A delicious frozen treat, with 2 scoops of ice cream flavor of your choice', FALSE, FALSE, FALSE, 'https://i.ibb.co/9WKxzmq/Souble-Scoop-Ice-Cream.png'),

/*Separate into type of ice cream for easy access*/
('Chocolate Double Scoop Ice Cream', 3.29, 'Dessert', 'A delicious frozen treat, with 2 scoops of Chocolate Ice Cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/9WKxzmq/Souble-Scoop-Ice-Cream.png'),
('Strawberry Double Scoop Ice Cream', 3.29, 'Dessert', 'A delicious frozen treat, with 2 scoops of Strawberry Ice Cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/9WKxzmq/Souble-Scoop-Ice-Cream.png'),
('Vanilla Double Scoop Ice Cream', 3.29, 'Dessert', 'A delicious frozen treat, with 2 scoops of Vanilla Ice Cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/9WKxzmq/Souble-Scoop-Ice-Cream.png'),
('Oreo Cookie Double Scoop Ice Cream', 3.29, 'Dessert', 'A delicious frozen treat, with 2 scoops of Oreo Cookie flavored Ice Cream', FALSE, FALSE, FALSE, 'https://i.ibb.co/9WKxzmq/Souble-Scoop-Ice-Cream.png'),


('Root Beer Float', 5.49, 'Dessert', 'A sweet treat with ice cream and root beer.', FALSE, FALSE, FALSE, 'https://i.ibb.co/BnqQrP5/Root-Beer-Float.png'),
('16 OZ Aquafina Water', 1.79, 'Beverage', 'Its just water.', FALSE, FALSE, FALSE, 'https://i.ibb.co/4SvZ8NK/Aquafina-Water-16-oz.png'),
('20 OZ Aquafina Water', 2.19, 'Beverage', 'Its just water.', FALSE, FALSE, FALSE, 'https://i.ibb.co/4SvZ8NK/Aquafina-Water-16-oz.png'),
('20 OZ Fountain Drink', 1.99, 'Beverage', 'A cool refreshing soda!', FALSE, FALSE, FALSE, 'https://i.ibb.co/k55yvTj/20-oz-Fountain-Drink.png'),

('Surf N Turf Burger', 15.00 , 'Seasonal', 'Enjoy the season with this limited time classic featuring fish and beef!', FALSE, FALSE, FALSE, 'https://i.ibb.co/xg9dQVT/Stuf-n-Turf.png');
