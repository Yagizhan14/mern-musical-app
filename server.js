const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();

mongoose.connect(
  process.env.MONGO_URI.toString(),
  { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
  err =>
    err
      ? console.log(err.message)
      : console.log('Successfully connected to MongoDB'),
);

const logger = (req, _, next) => {
  const log = `${new Date().toString()} from ${req.ip} ${req.method} => ${
    req.originalUrl
  } with the body of ${JSON.stringify(req.body)} `;
  console.log(log);
  fs.appendFile(
    './logs/server.txt',
    log + '\n',
    err => err && console.log(err),
  );
  next();
};

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/playlist', require('./routes/playlist'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set a static folder
  app.use(express.static('client/build'));

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is up and running on port ${port}`));
