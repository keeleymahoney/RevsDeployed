/**
 * @module indexAPI
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
/**
 * GET home page.
 * Renders the index page with specified title using EJS templating engine.
 *
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {undefined}
 */
exports.index = function(req, res){
res.render('index', { title: 'ejs' });};

module.exports = router;
