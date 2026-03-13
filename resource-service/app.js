const express = require("express");
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

app.use("/orders", orderRoutes);

app.listen(process.env.PORT, ()=>{
 console.log(`Resource service running on ${process.env.PORT}`);
});