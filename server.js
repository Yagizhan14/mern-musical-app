const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const config = require('config');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGO_URI || config.get('mongoURI'),{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false},(err) => err ? console.log(err.message) : console.log('Successfully connected to MongoDB'));

const logger = (req,res,next) => {
    const log = `${new Date().toString()} from ${req.ip} ${req.method} => ${req.originalUrl} with the body of ${JSON.stringify(req.body)} `;
    console.log(log);
    fs.appendFile('./logs/server.txt',log + '\n',(err) => err && console.log(err));
    next();
}

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);

// Routes
app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/playlist',require('./routes/playlist'));


// Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
    // Set a static folder
    app.use(express.static('client/build'));
    
    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server is up and running on port ${PORT}`));