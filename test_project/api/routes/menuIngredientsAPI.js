/**
 * Module for managing menu items and their ingredients in the database.
 * @module MenuItemIngredientsRouter
 */


var express = require("express");
var router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 3001;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

/**
 * Deletes an ingredient from a menu item.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function deleteIngredient(req, res, next) {
    const { item_name, ingredient_name } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE menu_item_ingredients SET quantity = -1 WHERE menu_item_name = $1 AND ingredient_name = $2', [item_name, ingredient_name])
        .then(() => {
            console.log(`Menu Item ${item_name} quantity updated to negative`);
            res.status(200).send('Ingredient quantity updated successfully');
        })
        .catch(err => {
            console.error('Error deleting menu item ingredient:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Adds an ingredient to a menu item.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function addIngredient(req, res, next) {
    const { item_name, ingredient_name, ingredient_quantity } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('INSERT INTO menu_item_ingredients (Menu_Item_Name, Ingredient_Name, Quantity) VALUES ($1, $2, $3);', [item_name, ingredient_name, ingredient_quantity])
        .then(() => {
            console.log(`Menu Item ${item_name} has ingredient ${ingredient_name} in it`);
            res.status(200).send('Ingredient quantity updated successfully');
        })
        .catch(err => {
            console.error('Error adding menu item ingredient :', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Updates the quantity of an ingredient for a menu item.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function updateIngredient(req, res, next) {
    const { item_name, ingredient_name, ingredient_quantity } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE menu_item_ingredients SET quantity = $1 WHERE menu_item_name = $2 AND ingredient_name = $3', [ingredient_quantity, item_name, ingredient_name])
        .then(() => {
            console.log(`Menu Item ${item_name} has ingredient ${ingredient_name} in it with quantity ${ingredient_quantity}`);
            res.status(200).send('Ingredient quantity updated successfully');
        })
        .catch(err => {
            console.error('Error updating menu item ingredient quantity:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Retrieves all ingredients for a specific menu item.
 * @function getSpecificIngredients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
router.get('/ingredients/:menuItemName', async (req, res) => {
    console.log("hello");
    const menuItemName = req.params.menuItemName;
    const ingredients = [];
  
    try {
      const result = await pool.query('SELECT * FROM menu_item_ingredients where menu_item_name = $1', [menuItemName]);
      if (result.rows.length > 0) {
          for(let i = 0; i < result.rows.length; i++)
          {
              ingredients.push(result.rows[i]);
          }
        console.log(ingredients);
        res.json(ingredients); // Assuming you want to return all details
      } else {
        res.status(404).send('Menu item ingredients not found');
      }
    } catch (err) {
      console.error('Error fetching menu item ingredients:', err);
      res.status(500).send('Internal Server Error');
    }
  });


// // Fetch ingredients for a specific menu item
// router.get('/ingredients/:menuItemName', async (req, res) => {
//     const { menuItemName } = req.params;
//     console.log(`Fetching ingredients for menu item: ${menuItemName}`);
//     try {
//         const result = await pool.query(
//             `SELECT mi.ingredient_name, mi.quantity AS quantityUsed, i.quantity_warning, i.quantity, i.unit, i.exp_date, i.storage_location
//             FROM menu_item_ingredients mi
//             JOIN Ingredients i ON mi.ingredient_name = i.ingredient_name
//             WHERE mi.menu_item_name = $1;`,
//             [menuItemName]
//         );
//         console.log(`Ingredients fetched: `, result.rows);
//         res.json(result.rows);
//     } catch (err) {
//         console.error("Error getting menu item ingredient details:", err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Delete a menu item
/**
 * Deletes a menu item from the database.
 * @function deleteMenuItem
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
router.delete('/menuItems/:itemName', async (req, res) => {
    const { itemName } = req.params;
    console.log(`Deleting menu item: ${itemName}`);
    try {
        await pool.query('DELETE FROM Menu_Items WHERE item_name = $1;', [itemName]);
        console.log('Menu item deleted successfully');
        res.send('Menu item deleted successfully');
    } catch (err) {
        console.error("Error deleting menu item:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Update a menu item and its ingredients
/**
 * Updates a menu item and its ingredients in the database.
 * @function updateMenuItem
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
router.put('/menuItems', async (req, res) => {
    const { price, category, oldName, newName, ingredients_menu_item } = req.body;
    console.log(`Updating menu item from ${oldName} to ${newName}`, req.body);
    try {
        // Update the menu item
        await pool.query(
            `UPDATE Menu_Items SET price = $1, menu_category = $2, item_name = $3 WHERE item_name = $4;`,
            [price, category, newName, oldName]
        );
        
        // Log for debugging
        console.log(`Menu item ${oldName} updated to ${newName} with price ${price} and category ${category}`);
        
        // Update ingredients for the menu item
        const updateIngredientPromises = ingredients_menu_item.map(ingredient => {
            console.log(`Updating ingredient ${ingredient.name} for menu item ${newName} with quantity ${ingredient.quantity}`);
            return pool.query(
                `UPDATE menu_item_ingredients SET quantity = $1 WHERE menu_item_name = $2 AND ingredient_name = $3;`,
                [ingredient.quantity, newName, ingredient.name]
            );
        });

        await Promise.all(updateIngredientPromises);
        console.log('Ingredients updated successfully');
        res.send('Menu item updated successfully');
    } catch (err) {
        console.error("Error updating menu item:", err);
        res.status(500).send('Internal Server Error');
    }
});

router.put("/delete", deleteIngredient);
router.post("/add", addIngredient);
router.put("/update", updateIngredient);


module.exports = router;
