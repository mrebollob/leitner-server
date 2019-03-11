var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'leitner-prod',
    clientEmail: 'firebase-adminsdk-phnun@leitner-prod.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDkA/FXSn0jBBSD\n4lv3eHBZ04inGsF2wUQKnsW1mmSe+00gu0D7I4VKTIvU4MRaC7wRJXlePSCSGIYI\nfcHYlomac5x4f/RNACUg7lHnAccRP962f6sZ3jXIw6pG3+zn8b3GAYkuFz0O6IxY\nzcAArs4wtg3F0G75Q+rzIYhV0Y3n+csP/9GGQWAGdHZnAVoLKe7iZTI9hvr1TNiC\nyW9ZZVxVpRxtHniwSs+t0fdep9ekWTRQpUp7+VhHEmIfDRE16gEYbN3+7yuzCk+e\nnoOCCzLKZh4vWSPuV1b1/Ax0Rruv18exBDUL/9s1vExLZH2Y1GOp86c2K7ZyvDYB\n9jV2OB8dAgMBAAECggEAHblz21TPFmMAR6cZJRwyzUr5vAsNYG1WcOn8zS1Y467Q\nAa3XjUW2qRZsfi5k+nYgKL4RYdsnJVSEGJRIUnNhcdyTb9QCZY1Yyb+3tp0xNcr1\nPiZLiF5C9a6oQoALkrsdabQmjXcjEw/2x9beqlgfchMxnXGMHfugI9zhuIpObQiQ\nx93Kl1RK8kImJM3c0JNV6BuvkwS7eFkSrw8svnf01fEQz5phQydnhZjwhhxSGiwz\nhtOnnFjzFZGOuIfO8GDbpewBLGTWF93HU3Ey1FJluLQj9Xkzh3CLNms+f8Ivp2MN\nEND3Xaj9/EPhh9RM2THqVRfTxi672Q4mZpgUyI1mgwKBgQD70fjogO89rjBxCPni\ndpT8Hmo8biIvxT7ziX4Sr757H09rDheP7p8NDDX4DkI6+p+a07YIXLmceuYwnbKc\nAHhbb1/zZtFH+yB4s8BL7vjqyK3wy53h9C+2UBB6q1X2Zo15G5qe67sXpT9xLW8N\nFZQPUzWdBw/QgjvFqsEFMRjdTwKBgQDnzNHYQIx7O3ttiiLtAykbeUbLXA1MXIUf\nFeoeZIDUuF4mc58pbvbnzUxok78QYqP9RK+pMv5eVp5RmCuYN2mlVlwBGbZJ0NFO\n18uGtaiNCpule6sMBbBZnm4vsltbNeHaU31ygnsZjeKEFFSOTB/B5y4zPBz9sUbw\nS785B9MZ0wKBgQCbZhEfkemRe7wDFVH3kcwQ5cgTcLeCGUvmyDNX3sJCgqjk3LZn\nqQ7X43AumsX+VYlG511PPcGBMkp5N+fv405ixpFEyG9f5zY7plmFwnwzjxHgJhdR\nR/plnHT+7lrHCrRFR2acqcY0KlLDShFc1rMe3e+Y7rGwr52pNt2UkZ7RewKBgQDi\nimhjwuII5h9A9QohPT+FnEc2JGbSxHFN6ir/PRYzz2QkjEd3RP2Fmj0cz5ihuOWw\ndtp+sFmtdVYRRHkGsNFNR1Nvt+NRzQVi2sAMjamG/mEToAORIlYxoAbsEpH6WHS8\n3W/y49bPKL3Ce+QPlhJLfVbHt+5VelZsLntaj20fBQKBgQDRNg0Fdij9VG+Bh7Rk\nDyTQ/0DDjHDHsa5fx3FIDoSsVds2NbyilX0XED77dpHz7v5PEmZBgUBfw60UQNvC\n8QRqOydbgUuJpRzU6NL5JG2aRzg5dFVg3MvM5XlNAlBjzIP2kBjl83O7iWpX51aK\nliE4njX+AkmZLbyeWXhQNTlHHg==\n-----END PRIVATE KEY-----\n'//process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://leitner-prod.firebaseio.com'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var levelsRouter = require('./routes/levels');
var questionsRouter = require('./routes/questions');
var docRouter = require('./routes/doc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/levels', levelsRouter);
app.use('/questions', questionsRouter);
app.use('/doc', docRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;