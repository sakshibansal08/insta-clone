const express = require("express");
const app = express();
const PORT = 4444;
const mongoose = require("mongoose");
const mongo_url = require("./key");
const cors = require("cors");

app.use(cors());

require('./models/model');


app.use(express.json());

app.use(require("./routes/auth"));

mongoose.connect(mongo_url);

mongoose.connection.on("connected" , ()=>{
    console.log("successfully connected to db");
})

mongoose.connection.on("error" , ()=>{
    console.log("not connected to db");
})

app.listen(PORT , () =>{
    console.log(`http://localhost:` + PORT);
})
