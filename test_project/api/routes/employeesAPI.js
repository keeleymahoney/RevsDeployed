/**
 * Module for managing employees in the database.
 * @module EmployeesRouter
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
 * Retrieves all employees from the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function getEmployees(req, res, next) {
    const employees = [];
    pool
    //get all of the ingredients where the quantity is less than 0
        .query('SELECT * FROM employee')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                employees.push(query_res.rows[i]);
            }
            //console.log(ingredients);
            // Send response inside the .then() block 
            res.send(employees);      
        })
        .catch(err => {
            // Handle any errors that occur during the query
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');      
    });
}

// Update employee function
/**
 * Updates an employee in the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */

function updateEmployee(req, res, next) {
    const { employee_id, employee_name, pswd, manager } = req.body;
    const updatePromises = [];

    // Create a promise for the update operation
    const promise = pool.query(
        'UPDATE employee SET employee_name = $1, pswd = $2, manager = $3 WHERE employee_id = $4',
        [employee_name, pswd, manager, employee_id]
    );
    updatePromises.push(promise);

    // Wait for the update promise to resolve
    Promise.all(updatePromises)
        .then(() => {
            console.log(`Employee ${employee_id} updated successfully`);
            res.status(200).send('Employee updated successfully');
        })
        .catch(err => {
            console.error('Error updating employee:', err);
            res.status(500).send('Internal Server Error');
        });
}

// Delete employee function
/**
 * Deletes an employee from the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */

function deleteEmployee(req, res, next) {
    const { employee_id } = req.body;
    pool.query('DELETE FROM employee WHERE employee_id = $1', [employee_id])
        .then(() => {
            console.log(`Employee ${employee_id} deleted successfully`);
            res.status(200).send('Employee deleted successfully');
        })
        .catch(err => {
            console.error('Error deleting employee:', err);
            res.status(500).send('Internal Server Error');
        });
}

// Add employee function
/**
 * Adds a new employee to the database.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function addEmployee(req, res, next) {
    const { employee_id, employee_name, pswd, manager } = req.body;
    pool.query('INSERT INTO employee (employee_name, pswd, manager) VALUES ($1, $2, $3)',
        [employee_name, pswd, manager])
        .then(() => {
            console.log(`Employee ${employee_name} added successfully`);
            res.status(200).send('Employee added successfully');
        })
        .catch(err => {
            console.error('Error adding employee:', err);
            res.status(500).send('Internal Server Error');
        });
}

// Define route handlers
router.get("/", getEmployees);
router.put("/update", updateEmployee);
router.put("/delete", deleteEmployee);
router.post("/add", addEmployee);

module.exports = router;