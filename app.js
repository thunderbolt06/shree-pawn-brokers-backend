const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const pawnsRoutes = require('./routes/pawns-routes');
const stockRoutes = require('./routes/stock-routes');
const changelogRoutes = require('./routes/changelog-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("backendsumbit");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pawns', pawnsRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/changelog', changelogRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zuv4hcf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

