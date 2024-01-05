const express=require('express');
const  mongoose  = require('mongoose');
const {MONGODBURI}=require('./key')
const connectDB=require('./Connection')
const bodyParser = require('body-parser');
const app=express();
const cors = require('cors');//this can be enable by adding "proxy":"http://localhost:5000" at front end package.json file at the top

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

connectDB();
require('./models/user')
require('./models/post')

const PORT=5000;




app.use(require('./route/auth'))
app.use(require('./route/post'))
app.use(require('./route/user'))



app.listen(PORT,()=>{console.log("Server is running on port",PORT)})


