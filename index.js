const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongoose = require('mongoose');
const User = require('./models/user');
const Community = require('./models/community');
const initDB = require('./db-init');

const port = process.env.port || 3000;
 
// set up express app
const app = express();

mongoose.Promise = global.Promise;
// connect to database
mongoose.connect('mongodb://mongo:27017/communityDB')
        .then(() => {
            console.log('connected to database...');
            // init db
            initDB();
        })
        .catch(err => {
            console.log('error connecting to the database');
            process.exit();
        })

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost: 4000' );
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

//initialize routes
app.use('/api', require('./routes/app'));


// error handling middleware
app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
})


// listen for requests
app.listen(port, () => {
    console.log(`server listening on port ${port}....`);
});