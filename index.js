const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongoose = require('mongoose');
const User = require('./models/user');
const Community = require('./models/community');

const port = process.env.port || 3000;
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Communities API',
            description: 'Communities API Information',
        },
        basePath: "/api",
        servers: ["http://localhost:3000"]
    },
    apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
 
// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/communityDB');
mongoose.Promise = global.Promise;

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