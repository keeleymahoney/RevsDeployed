var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesAPIRouter = require("./routes/employeesAPI");
var ingredientsAPIRouter = require('./routes/ingredientsAPI');
var landingAPIRouter = require('./routes/landingAPI');
var trendsAPIRouter = require('./routes/trendsAPI');
var menuItemsAPIRouter = require('./routes/menuItemsAPI');
var customerOrdersAPIRouter = require('./routes/customerOrdersAPI');
var menuIngredientsAPIRouter = require('./routes/menuIngredientsAPI');
var suppliersAPIRouter = require('./routes/suppliersAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/employeesAPI", employeesAPIRouter);
app.use("/ingredientsAPI", ingredientsAPIRouter);
app.use("/landingAPI", landingAPIRouter);
app.use("/trendsAPI", trendsAPIRouter);
app.use("/menuItemsAPI", menuItemsAPIRouter);
app.use("/customerOrdersAPI", customerOrdersAPIRouter);
app.use("/menuIngredientsAPI", menuIngredientsAPIRouter);
app.use("/suppliersAPI", suppliersAPIRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


// // error handler
// app.use(function(err, req, res, next) {
//   console.error(err); // Log the error
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;