/**
 * @module TrendsAPI
 * @author Alyan A. Tharani
 */

var express = require("express");
var router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const axios = require('axios'); 
const port = 3001;

/**
 * Configures and creates a PostgreSQL connection pool using environment variables.
 * @method Pool
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, //new for debugging
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

/**
 * Handles SIGINT (Ctrl+C) signal by closing the PostgreSQL connection pool
 * and gracefully shutting down the application.
 * @function ONSIGINT
 */
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

// View engine setup
app.set("view engine", "ejs");

/**
 * Handles GET requests to fetch sales reports for items sold after a given start date.
 * The report includes the menu item name and the total units sold.
 * @function sales-report
 * @param {Express.Request} req - The request object containing startDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 */
router.get('/sales-report', async (req, res) => {
    const { startDate } = req.query;
    const query = `
        SELECT mi.Item_Name AS MenuItemName, SUM(cod.quantity) AS TotalUnitsSold
        FROM Menu_Items mi
        JOIN Customer_Order_Details cod ON mi.Item_Name = cod.menu_item
        JOIN Customer_Orders co ON cod.order_number = co.order_number
        WHERE co.order_date BETWEEN $1 AND CURRENT_DATE
        GROUP BY mi.Item_Name;
    `;

    try {
        const results = await pool.query(query, [startDate]);
        res.json(results.rows);
    } catch (error) {
        console.error('Error executing sales report query:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handles GET requests to fetch an excess inventory report.
 * The report lists ingredients that are underutilized compared to their available quantity.
 * @param {Express.Request} req - The request object containing startDate and endDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function excess-report
 */
router.get('/excess-report', async (req, res) => {
    const { startDate, endDate } = req.query;
    const query = `
        WITH CurrentInventory AS (
            SELECT ingredient_name, quantity AS total_quantity_available
            FROM ingredients
        ),
        Used AS (
            SELECT mii.ingredient_name, SUM(mii.quantity * cod.quantity) AS total_quantity_used
            FROM customer_order_details cod
            JOIN menu_item_ingredients mii ON cod.menu_item = mii.menu_item_name
            JOIN customer_orders co ON cod.order_number = co.order_number
            WHERE co.order_date BETWEEN $1 AND $2
            GROUP BY mii.ingredient_name
        )
        SELECT ci.ingredient_name,
               ci.total_quantity_available,
               COALESCE(u.total_quantity_used, 0) AS total_quantity_used,
               ci.total_quantity_available - COALESCE(u.total_quantity_used, 0) AS excess_quantity
        FROM CurrentInventory ci
        LEFT JOIN Used u ON ci.ingredient_name = u.ingredient_name
        WHERE COALESCE(u.total_quantity_used, 0) <= (0.1 * ci.total_quantity_available);
    `;

    try {
        const results = await pool.query(query, [startDate, endDate]);
        res.json(results.rows.filter(item => item.excess_quantity > 0));
    } catch (error) {
        console.error('Error executing excess report query:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * Handles GET requests to fetch a restock report.
 * This report identifies ingredients that need restocking based on a warning quantity level.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function excess-report
 */
router.get('/restock-report', async (req, res) => {
    const query = `
        SELECT ingredient_name, quantity_warning, quantity
        FROM ingredients
        WHERE quantity <= quantity_warning AND quantity >= 0;
    `;

    try {
        const results = await pool.query(query);
        if (results.rows.length > 0) {
            res.json(results.rows);
        } else {
            res.status(404).send('No data found that meets the criteria.');
        }
    } catch (error) {
        console.error('Error executing restock report query:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * Handles GET requests to generate a report showing pairs of menu items frequently ordered together.
 * @param {Express.Request} req - The request object containing startDate and endDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function double-order-report
 */
router.get('/double-order-report', async (req, res) => {
    const { startDate, endDate } = req.query;
    const query = `
        SELECT cod1.menu_item AS Item1, cod2.menu_item AS Item2, COUNT(*) AS Frequency
        FROM Customer_Order_Details cod1
        JOIN Customer_Order_Details cod2 ON cod1.order_number = cod2.order_number AND cod1.menu_item < cod2.menu_item
        JOIN Customer_Orders co ON cod1.order_number = co.order_number
        WHERE co.order_date BETWEEN $1 AND $2
        GROUP BY cod1.menu_item, cod2.menu_item
        ORDER BY Frequency DESC;
    `;

    try {
        const results = await pool.query(query, [startDate, endDate]);
        res.json(results.rows);
    } catch (error) {
        console.error('Error executing double order report query:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handles GET requests to fetch usage data for specific ingredients over a specified date range.
 * Additional filtering by ingredient name is optional.
 * @param {Express.Request} req - The request object containing startDate, endDate, and optionally ingredientName in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function ingredient-usage-report
 */
router.get('/ingredient-usage-report', async (req, res) => {
    const { startDate, endDate, ingredientName } = req.query;
    let query = `
        SELECT i.ingredient_name, co.order_date, SUM(cod.quantity * mii.Quantity) AS TotalUsed
        FROM Customer_Order_Details cod
        JOIN Customer_Orders co ON cod.order_number = co.order_number
        JOIN Menu_Item_Ingredients mii ON cod.menu_item = mii.Menu_Item_Name
        JOIN Ingredients i ON mii.Ingredient_Name = i.ingredient_name
        WHERE co.order_date BETWEEN $1 AND $2
    `;

    const queryParams = [startDate, endDate];

    if (ingredientName) {
        query += ` AND i.ingredient_name = $3`;
        queryParams.push(ingredientName);
    }

    query += ` GROUP BY i.ingredient_name, co.order_date ORDER BY co.order_date;`;

    try {
        const results = await pool.query(query, queryParams);
        res.json(results.rows);
    } catch (error) {
        console.error('Error executing ingredient usage report query:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handles GET requests to fetch a daily closing report (Z-Report) that sums up sales by menu category for the current day.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function z-report
 */
router.get('/z-report', async (req, res) => {
    const query = `
        SELECT mi.menu_category AS Category, SUM(cod.quantity * mi.price) AS TotalSales
        FROM menu_items mi
        JOIN customer_order_details cod ON mi.item_name = cod.menu_item
        JOIN customer_orders co ON cod.order_number = co.order_number
        WHERE co.order_date = CURRENT_DATE
        GROUP BY mi.menu_category
        ORDER BY TotalSales DESC;
    `;

    try {
        const results = await pool.query(query);
        if (results.rows.length > 0) {
            res.json(results.rows);
        } else {
            res.status(404).send('No data found for the specified date');
        }
    } catch (error) {
        console.error(`Error executing Z report query: ${error}`);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handles GET requests to fetch a report (X-Report) that sums up sales by menu category over a specified date range.
 * @param {Express.Request} req - The request object containing startDate and endDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function x-report
 */
router.get('/x-report', async (req, res) => {
    const { startDate, endDate } = req.query;
    const query = `
        SELECT mi.menu_category AS Category, SUM(cod.quantity * mi.price) AS TotalSales
        FROM menu_items mi
        JOIN customer_order_details cod ON mi.item_name = cod.menu_item
        JOIN customer_orders co ON cod.order_number = co.order_number
        WHERE co.order_date BETWEEN $1 AND $2
        GROUP BY mi.menu_category
        ORDER BY TotalSales DESC;
    `;

    try {
        const results = await pool.query(query, [startDate, endDate]);
        if (results.rows.length > 0) {
            res.json(results.rows);
        } else {
            res.status(404).send('No data found for the given date range');
        }
    } catch (error) {
        console.error(`Error executing X report query: ${error}`);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Handles GET requests to analyze the correlation between weather conditions and popular menu items.
 * It fetches weather data for a given date range and correlates it with top-selling menu items.
 * @param {Express.Request} req - The request object containing startDate and endDate in the query.
 * @param {Express.Response} res - The response object used to send back data or errors.
 * @function weather-menu-trends
 */
//Weather API Key - 78704ef4345c439881911149242704
router.get('/weather-menu-trends', async (req, res) => {
    const { startDate, endDate } = req.query;

    // Function to fetch weather data using coordinates
    async function getWeatherByDate(date) {
        const latitude = "30.615011";
        const longitude = "-96.342476";
        const weatherUrl = `https://api.weatherapi.com/v1/history.json?key=78704ef4345c439881911149242704&q=${latitude},${longitude}&dt=${date}`;
        try {
            const response = await axios.get(weatherUrl);
            return response.data.forecast.forecastday[0].day.condition.text;
        } catch (error) {
            console.error(`Error fetching weather data for ${date}: ${error}`);
            return null;  // Return null if there is an error, so you can handle this case later
        }
    }

    // Weather Helper Function
    function generateDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dateList = [];

        for(let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            dateList.push(new Date(dt).toISOString().split('T')[0]); // ISO String: YYYY-MM-DD
        }

        return dateList;
    }

    try {
        let dateList = generateDateRange(startDate, endDate);
        let weatherPromises = dateList.map(date => getWeatherByDate(date));
        let weatherResults = await Promise.all(weatherPromises);

        let queryResults = await Promise.all(dateList.map((date, index) => {
            if (!weatherResults[index]) return Promise.resolve({ date, weather: 'No data', topMenuItem: null });

            const weather = weatherResults[index];
            const query = `
                SELECT cod.menu_item AS MenuItem, SUM(cod.quantity) AS TotalQuantity
                FROM customer_order_details cod
                JOIN customer_orders co ON cod.order_number = co.order_number
                WHERE co.order_date = $1
                GROUP BY cod.menu_item
                ORDER BY TotalQuantity DESC
                LIMIT 1;
            `;

            return pool.query(query, [date]).then(result => {

                if (result.rows.length > 0) {
                    return {
                        date,
                        weather,
                        topMenuItem: {
                            MenuItem: result.rows[0].menuitem,
                            TotalQuantity: result.rows[0].totalquantity
                        }
                    };
                } else {
                    return { date, weather, topMenuItem: 'No data' };
                }
            });
            
        }));

        res.json(queryResults.filter(x => x));
    } catch (error) {
        console.error('Error fetching menu item trends:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;

