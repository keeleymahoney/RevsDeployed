
/**
 * Module for managing ingredients in the database.
 * @module IngredientsRouter
 */

//defining variables
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

// Define getIngredients function
/**
 * Retrieves all ingredients from the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function getIngredients(req, res, next) {
    const ingredients = [];
    pool
    //get all of the ingredients
        .query('SELECT * FROM ingredients')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                ingredients.push(query_res.rows[i]);
            }
            //console.log(ingredients);
            // Send response inside the .then() block 
            res.send(ingredients);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

// Update ingredients function
/**
 * Updates multiple ingredients in the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function updateIngredientsMany(req, res, next) {
    const updatedIngredients = req.body;

    // Array to store all promises
    const updatePromises = [];

    // Loop through the updated ingredients and create a promise for each update query
    updatedIngredients.forEach(ingredient => {
        console.log(ingredient.quantity + " min quant " + ingredient.quantity_warning+ "unit: " + ingredient.unit + "storage loc: " + ingredient.storage_location + " name: " + ingredient.ingredient_name);
        const updatePromise = pool.query('UPDATE ingredients SET quantity = $1, quantity_warning = $2, unit = $3, storage_location = $4, vegetarian = $5, glutenfree = $6, customizable = $8 WHERE ingredient_name = $7',
            [ingredient.quantity, ingredient.quantity_warning, ingredient.unit, ingredient.storage_location, ingredient.vegetarian, ingredient.glutenfree, ingredient.ingredient_name, ingredient.customizable])
            .then(() => {
                console.log(`Ingredient ${ingredient.ingredient_name} updated successfully`);
            })
            .catch(err => {
                console.error('Error updating ingredient:', err);
                throw err; // Propagate the error to the outer promise chain
            });

        // Add the promise to the array
        updatePromises.push(updatePromise);
    });

    // Wait for all promises to resolve
    Promise.all(updatePromises)
        .then(() => {
            // Send the response after all update queries are completed
            res.status(200).send('Changes successfully submitted');
        })
        .catch(err => {
            // Handle any errors
            console.error('Error updating ingredients:', err);
            res.status(500).send('Internal Server Error');
        });
}

/**
 * Updates a single ingredient in the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function updateIngredients(req, res, next) {
    const { ingredient_name, quantity, quantity_warning, unit, storage_location, vegetarian, glutenfree, customizable } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE ingredients SET quantity = $1, quantity_warning = $2, unit = $3, storage_location = $4,  vegetarian = $5, glutenfree = $6, customizable = $8 WHERE ingredient_name = $7', [quantity, quantity_warning, unit, storage_location, vegetarian, glutenfree, ingredient_name, customizable])
        .then(() => {
            console.log(`Ingredient ${ingredient_name} has been updated`);
            res.status(200).send('Ingredient has been updated');
        })
        .catch(err => {
            console.error('Error updating ingredient:', err);
            res.status(500).send('Internal Server Error');
        });
}

//delete ingredients function
/**
 * Deletes an ingredient from the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function deleteIngredient(req, res, next) {
    const { ingredient_name } = req.body;

    //set the quantity to be negative, indicating it no longer exists
    pool.query('UPDATE ingredients SET quantity = -1 WHERE ingredient_name = $1', [ingredient_name])
        .then(() => {
            console.log(`Ingredient ${ingredient_name} quantity updated to negative`);
            res.status(200).send('Ingredient quantity updated successfully');
        })
        .catch(err => {
            console.error('Error updating ingredient quantity:', err);
            res.status(500).send('Internal Server Error');
        });
}

// Define the route for adding a new ingredient
/**
 * Adds a new ingredient to the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function addIngredient(req, res, next) {
    const { ingredient_name, quantity, quantity_warning, unit, storage_location, vegetarian, glutenfree, customizable } = req.body;
    //add new ingredient
    pool.query('INSERT INTO ingredients (ingredient_name, quantity, quantity_warning, unit, storage_location, vegetarian, glutenfree, customizable) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [ingredient_name, quantity, quantity_warning, unit, storage_location, vegetarian, glutenfree, customizable])
        .then(() => {
            console.log(`Ingredient ${ingredient_name} added successfully`);
            res.status(200).send('Ingredient added successfully');
        })
        .catch(err => {
            console.error('Error adding ingredient:', err);
            res.status(500).send('Internal Server Error');
        });
}

// Define route handlers
router.get("/", getIngredients);
router.put("/update", updateIngredients);
router.put("/updateMany", updateIngredientsMany);
router.put("/delete", deleteIngredient);
router.post("/add", addIngredient);


module.exports = router;