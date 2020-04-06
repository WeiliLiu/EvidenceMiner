var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var lineReader = require('line-reader');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var documents = require('./routes/documents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/documents', documents);

// initialize elasticsearch server
var elastic = require('./elasticsearch');  
elastic.indexExists().then(function (exists) {  
  if (exists) {
    return elastic.deleteIndex();
  }
}).then(function () {
  return elastic.initIndex()
          .then(response => {console.log("Index created")})
            .then(function() {
              var documents = []
              lineReader.eachLine('pubmed_with_pattern.json', documents.push(function(line) {
                currLine = JSON.parse(line);
                return currLine;
              }));
              console.log(documents)
            })
            // .then(function() {
            //   var promises = [
            //     'Thing Explainer',
            //     'The Internet Is a Playground'
            //   ].map(function (bookTitle) {
            //     return elastic.addDocument({
            //       title: bookTitle,
            //       content: bookTitle + " content",
            //       metadata: {
            //         titleLength: bookTitle.length
            //       }
            //     });
            //   });
            //   console.log("Documents added");
            //   return Promise.all(promises);
            // })
            .catch(error => {console.log("Error adding documents")})
          .catch(error => {console.log("Error creating index")});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
