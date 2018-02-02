const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const users = require('./routes/users');
const classify = require('./routes/classify');
const dish = require('./routes/dish');
const file = require('./routes/file');
const databases = require('./define/databases');



const back = require('./routes/back/index');
const Bshops = require('./routes/back/shops');
const menu = require('./routes/back/menu');
const unit = require('./routes/back/unit');
const businessInfor = require('./routes/back/businessInfor');


const app = express();

// view engine setup
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/file/uploading', file);

app.use('/', index);
app.use('/getCla', classify);
app.use('/getdish', dish);

// 后台路由
app.use('/back', back);
app.use('/back/shops', Bshops);
app.use('/back/menu', menu);
app.use('/back/units', unit);
app.use('/back/businessInfor', businessInfor);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
