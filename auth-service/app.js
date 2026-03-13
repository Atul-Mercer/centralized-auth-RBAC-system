const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/test",(req,res)=>{
    console.log("Test route working");
    res.send("Server OK");
  });

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(8080, ()=>{
 console.log("Auth service running on port 8080");
});