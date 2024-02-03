// Imported external and internal modules
const router = require('./routes/index');
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const app= express();
app.use(bodyParser.json())
app.use(cors());
app.use(router);
app.listen(5000,()=>{
    console.log('app is listening on port 5000')
})
//module.exports = app;
