/**
 * Module for managing supplier orders and order details in the database.
 * @module SupplierOrderRouter
 */

var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
})

// Create express app
const app = express();
const port = 3001;

// Fetch all supplier orders
/**
 * Route to fetch all supplier orders.
 * @name GET /supplier/orders
 * @function getSupplierOrders
 * @memberof module:SupplierOrderRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/orders', async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM supplier_orders ORDER BY order_number DESC');
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

/**
 * Route to fetch details of a specific supplier order.
 * @name GET /supplier/order-details/:orderNumber
 * @function getSupplierOrderDetails
 * @memberof module:SupplierOrderRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} req.params.orderNumber - The order number of the supplier order.
 */
router.get('/order-details/:orderNumber', async (req, res) => {
    const { orderNumber } = req.params;
    try {
        const results = await pool.query('SELECT * FROM Supplier_Order_Details WHERE Order_Number = $1', [orderNumber]);
        console.log(results);
        const formattedResults = results.rows.map(row => ({
            // Extract relevant data from each row
            name: row.ingredient,
            quantityOrdered: row.quantity_ordered,
        }));
        
        console.log(formattedResults);
        // Send the formatted results as JSON response
        res.json(formattedResults);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// Create a new supplier order
/**
 * Route to create a new supplier order.
 * @name POST /supplier/new-order
 * @function supplierNewOrder
 * @memberof module:SupplierOrderRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Array<Object>} req.body.currentOrderIngredients - Array of objects containing information about the ingredients in the order.
 * @param {string} req.body.thisorderTime - The time when the order is placed.
 * @param {string} req.body.thisorderDate - The date when the order is placed.
 * @param {string} req.body.supplierName - The name of the supplier.
 * @param {string} req.body.orderNumber - The unique identifier for the order.
 */
router.post('/new-order', async (req, res) => {
    const {currentOrderIngredients, thisorderTime, thisorderDate, supplierName, orderNumber } = req.body; // Assuming ingredients is an array of {ingredient, quantity_ordered, wholesale_unit_price}
    try {
        const orderResult = await pool.query('INSERT INTO supplier_orders (order_number, order_date, order_time, cost, supplier) VALUES ($1, $2, $3, 0, $4)', [orderNumber, thisorderDate, thisorderTime, supplierName]);
        const newOrder = orderResult.rows[0];
        console.log("does this work");
        
        let totalCost = 0;
        for (let ingredient of currentOrderIngredients) {
            const { name, quantityOrdered, quantityReceived, wholesalePrice } = ingredient;
            totalCost += quantityOrdered * wholesalePrice;
            await pool.query('INSERT INTO supplier_order_details (order_number, ingredient, quantity_ordered, quantity_received, received, wholesale_unit_price) VALUES ($1, $2, $3, $4, true, $5)', [orderNumber, name, quantityOrdered, quantityReceived, wholesalePrice]);
        }

        // Update the order cost after calculating
        await pool.query('UPDATE supplier_orders SET cost = $1 WHERE order_number = $2', [totalCost, orderNumber]);

        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
