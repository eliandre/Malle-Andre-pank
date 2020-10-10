const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const usersRoute = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('docs/swagger.yaml');
const User = require('./models/User');
const sessionsRoute = require('./routes/sessions');

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
app.use('/users', usersRoute);
app.use('/sessions', sessionsRoute);

app.listen(3000);

module.exports = app;