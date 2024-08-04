/**
 * Module for managing menu items in the database.
 * @module MenuItemsAPI
 */

var express = require("express");
var router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 3001;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

/**
 * Retrieves menu items from the database and sends them as a response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function getMenuItems(req, res, next) {
    const menuItems = [];
    pool
        .query('SELECT * FROM Menu_Items;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menuItems.push(query_res.rows[i]);
            }
            //console.log(menuItems);
            // Send response inside the .then() block 
            res.send(menuItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Retrieves entree items from the database and sends them as a response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function getEntrees(req, res, next) {
    const entreeItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE Menu_Category = \'Entree\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreeItems.push(query_res.rows[i]);
            }
            console.log(entreeItems);
            // Send response inside the .then() block 
            res.send(entreeItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Deletes a menu item from the database.
 * 
 * @param {Object} req - The request object containing the item_name to be deleted.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function deleteItem(req, res, next) {
    const { item_name } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE menu_items SET price = -1 WHERE item_name = $1', [item_name])
        .then(() => {
            console.log(`Menu Item ${item_name} quantity updated to negative`);
            res.status(200).send('Menu item deleted successfully');
        })
        .catch(err => {
            console.error('Error deleting menu item:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Add a new item to the menu_items table in the database.
 * 
 * @param {object} req - The request object containing the item details in the body.
 * @param {object} res - The response object to send back the result.
 * @param {function} next - The next middleware function.
 */
function addItem(req, res, next) {
    const { item_name, price, menu_category, descript, picture, promoted, vegetarian, glutenfree } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('INSERT INTO menu_items (Item_Name, Price, Menu_Category, descript, vegetarian, glutenfree, promoted, Picture) VALUES($1, $2, $3, $4, $7, $8, $6, $5);', [item_name, price, menu_category, descript, picture, promoted, vegetarian, glutenfree])
        .then(() => {
            console.log("Menu Item ${item_name} has been added");
            res.status(200).send('Menu item added successfully');
        })
        .catch(err => {
            console.error('Error adding menu item:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Edit an existing item in the menu_items table in the database.
 * 
 * @param {object} req - The request object containing the updated item details in the body.
 * @param {object} res - The response object to send back the result.
 * @param {function} next - The next middleware function.
 */
function editItem(req, res, next) {
    const { price, menu_category, item_name, picture, descript, promoted, glutenfree, vegetarian } = req.body;
    console.log(item_name);
    console.log(price);
    console.log(menu_category);

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE menu_items SET price = $1, menu_category = $2, descript = $3, vegetarian = $7, glutenfree = $8, promoted = $6, Picture = $4 WHERE item_name = $5', [price, menu_category, descript, picture, item_name, promoted, vegetarian, glutenfree])
        .then(() => {
            console.log(`Menu Item ${item_name} price and category updated`);
            res.status(200).send('Menu Item updated successfully');
        })
        .catch(err => {
            console.error('Error updating menu item:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Retrieve all side items from the menu_items table in the database.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the side items.
 * @param {function} next - The next middleware function.
 */
function getSides(req, res, next) {
    const sideItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE Menu_Category = \'Side\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sideItems.push(query_res.rows[i]);
            }
            // console.log(sideItems);
            // Send response inside the .then() block 
            res.send(sideItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Retrieve all dessert items from the menu_items table in the database.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the results.
 * @param {function} next - The next middleware function.
 */
function getDesserts(req, res, next) {
    const dessertItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE Menu_Category = \'Dessert\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                dessertItems.push(query_res.rows[i]);
            }
            // console.log(dessertItems);
            // Send response inside the .then() block 
            res.send(dessertItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Retrieve all beverage items from the menu_items table in the database.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the results.
 * @param {function} next - The next middleware function.
 */
function getBeverages(req, res, next) {
    const beverageItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE Menu_Category = \'Beverage\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                beverageItems.push(query_res.rows[i]);
            }
            // console.log(beverageItems);
            // Send response inside the .then() block 
            res.send(beverageItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Retrieve all seasonal items from the menu_items table in the database.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the results.
 * @param {function} next - The next middleware function.
 */
function getSeasonals(req, res, next) {
    const seasonalItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE Menu_Category = \'Seasonal\';')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                seasonalItems.push(query_res.rows[i]);
            }
            // console.log(seasonalItems);
            // Send response inside the .then() block 
            res.send(seasonalItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Retrieve all promoted items from the menu_items table in the database.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the results.
 * @param {function} next - The next middleware function.
 */
function getPromotions(req, res, next) {
    const seasonalItems = [];
    pool
        .query('SELECT * FROM Menu_Items WHERE promoted = true;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                seasonalItems.push(query_res.rows[i]);
            }
            res.send(seasonalItems);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}
/**
 * Fetches weather data from the OpenWeatherMap API based on specified coordinates.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object to send back the weather data.
 * @param {function} next - The next middleware function.
 */
function getWeather(req, res, next) {

    //A&M Coordinates
    const latitude = "30.615011";
    const longitude = "-96.342476";

    const api_url = 'https://api.openweathermap.org/data/2.5';
    const api_key = '2287b881cbc011fa0af77a7c93b7d290';
    const app_url = 'https://openweathermap.org/img/w';

    return fetch(
        `${api_url}/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api_key}`
    )
        .then(res => res.json())
        .then(result => {
            // setData(result)
            console.log(result);
            res.send(result);
    });
}

/**
 * Updates the database to set selected menu items as promoted.
 * 
 * @param {object} req - The request object containing the selected items for promotion.
 * @param {object} res - The response object to send back the result.
 * @param {function} next - The next middleware function.
 */
function savePromotions(req, res, next) {
    const { selectedItems } = req.body;
    
    if(!selectedItems || selectedItems.length === 0) {
        console.log('No items selected for promotion');
        return res.status(400).send('No items selected for promotion');
    }

    pool.query(
        `UPDATE Menu_items 
         SET promoted = CASE 
                          WHEN item_name IN (${selectedItems.map((item, index) => `$${index + 1}`).join(',')}) THEN true 
                          ELSE false 
                        END`,
        selectedItems
    )
    .then(() => {
        console.log(`Database updated for promotions`);
        res.status(200).send('Promotions updated');
    })
    .catch(err => {
        console.error('Error updating promotions:', err);
        res.status(500).send('Internal Server Error');
    });
}

// Use getIngredients function in the route handler
router.get("/", getMenuItems);
router.get("/entrees", getEntrees);
router.get("/sides", getSides);
router.get("/desserts", getDesserts);
router.get("/beverages", getBeverages);
router.get("/seasonals", getSeasonals);
router.get("/promotions", getPromotions);
router.get("/weather", getWeather);
router.put("/delete", deleteItem);
router.put("/edit", editItem);
router.post("/add", addItem);
router.post("/savePromotions", savePromotions);

module.exports = router;