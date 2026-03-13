const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
 resource:String,
 action:String
});

module.exports = mongoose.model("Permission", permissionSchema);