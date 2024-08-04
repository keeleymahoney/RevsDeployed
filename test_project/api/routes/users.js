/**
 * @module usersAPI
 */


var express = require('express');
var router = express.Router();

/* GET users listing. */
/**
 * GET users listing.
 * Responds with a resource related to users.
 *
 * @function
 * @name getUsers
 * @memberof module:usersAPI
 * @path {GET} /
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @param {Function} next - Next middleware function.
 * @returns {undefined}
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
