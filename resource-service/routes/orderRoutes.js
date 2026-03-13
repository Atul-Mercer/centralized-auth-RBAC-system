const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const permit = require("../middleware/permissionMiddleware");

router.get("/",auth,permit("orders:read"),(req,res)=>{
 res.json({message:"Orders list"});
});

router.post("/",auth,permit("orders:write"),(req,res)=>{
 res.json({message:"Order created"});
});

router.delete("/:id",auth,permit("orders:delete"),(req,res)=>{
 res.json({message:"Order deleted"});
});

module.exports = router;