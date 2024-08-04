/**
 * @module landingAPI
 * @author Brandon Cisneros
 */
var express = require("express");
var router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create express app
const app = express();
const port = 3001;

/**
 * Configures and creates a PostgreSQL connection pool using environment variables.
 * @method Pool
 */
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

/**
 * Handles SIGINT (Ctrl+C) signal by closing the PostgreSQL connection pool
 * and gracefully shutting down the application.
 * @route ON /SIGINT
 */
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

/**
 * Retrieves a list of ingredients from the database.
 * This function queries the database for all ingredients and sends the list as a response.
 *
 * @param req The HTTP request object.
 * @param res The HTTP response object.
 * @param next The next middleware function.
 * @throws SQLException if an SQL exception occurs while querying the database.
 */
function getIngredients(req, res, next) {
    const ingredients = [];
    pool
        .query('SELECT * FROM ingredients;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                ingredients.push(query_res.rows[i]);
            }
            console.log(ingredients);
            // Send response inside the .then() block 
            res.send(ingredients);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

/**
 * Handles GET requests to fetch ingredients report.
 * @param {Express.Request} req - The request object containing startDate and endDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @route GET /getIngredients
 */
router.get("/", getIngredients);

module.exports = router;