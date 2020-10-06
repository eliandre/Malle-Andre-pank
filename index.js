const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const routes = require('./routes');
const usersRoute = require('./routes/users'); //uus
const swaggerUi = require('swagger-ui-express'); //uus
const yaml = require('yamljs') // uus
const swaggerDocument = yaml.load('docs/swagger.yaml') // uus


// Connect to database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(){
    console.log('Connected!');
});

const app = express();

// Run middlewares
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Attach routes
//app.use('/', routes);
app.use('/users', usersRoute);
app.listen(3000);

module.exports = app;