const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 
const app = express();
const multer = require('multer');
const cors = require("cors");
require("dotenv").config();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any());


mongoose.connect(`mongodb+srv://pushpak:${process.env.cluster_Password}@radoncluster.opqe2.mongodb.net/${process.env.cluster_Name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true
})
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});