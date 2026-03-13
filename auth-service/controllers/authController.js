// const User = require("../models/User");
// const Role = require("../models/Role");
// const Permission = require("../models/Permission");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     // Find user and populate roles + permissions
//     const user = await User.findOne({ email }).populate({
//       path: "roles",
//       populate: {
//         path: "permissions"
//       }
//     });

//     console.log("User found:", user);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     // Check password
//     const validPassword = await bcrypt.compare(password, user.password);

//     console.log("Password valid:", validPassword);

//     if (!validPassword) {
//       return res.status(401).json({
//         message: "Invalid credentials"
//       });
//     }

//     // Extract permissions
//     const permissions = [];

//     user.roles.forEach(role => {
//       role.permissions.forEach(permission => {
//         permissions.push(`${permission.resource}:${permission.action}`);
//       });
//     });

//     console.log("Permissions:", permissions);

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         permissions
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     // Send token
//     res.json({
//       accessToken: token
//     });

//   } catch (error) {
//     console.error("Login error:", error);

//     res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// };


// exports.refreshToken = async (req,res)=>{

//   const {refreshToken} = req.body;
 
//   if(!refreshToken){
//     return res.status(401).json({message:"Refresh token required"});
//   }
 
//   try{
 
//     const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);
 
//     const newAccessToken = jwt.sign(
//       {id:decoded.id,permissions:decoded.permissions},
//       process.env.JWT_SECRET,
//       {expiresIn:"15m"}
//     );
 
//     res.json({accessToken:newAccessToken});
 
//   }catch(err){
 
//     res.status(403).json({message:"Invalid refresh token"});
//   }
 
//  }


//  exports.logout = async (req,res)=>{

//   res.json({
//    message:"User logged out successfully"
//   });
 
//  }

const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ===================== LOGIN =====================

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user with roles and permissions
    const user = await User.findOne({ email }).populate({
      path: "roles",
      populate: {
        path: "permissions"
      }
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    console.log("Password valid:", validPassword);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Extract permissions
    const permissions = [];

    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissions.push(`${permission.resource}:${permission.action}`);
      });
    });

    console.log("Permissions:", permissions);

    // Create Access Token
    const accessToken = jwt.sign(
      {
        id: user._id,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Create Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken,
      refreshToken
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }
};



// ===================== REFRESH TOKEN =====================

exports.refreshToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Fetch user again
    const user = await User.findById(decoded.id).populate({
      path: "roles",
      populate: {
        path: "permissions"
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Rebuild permissions
    const permissions = [];

    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissions.push(`${permission.resource}:${permission.action}`);
      });
    });

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {

    console.error("Refresh token error:", error);

    res.status(403).json({
      message: "Invalid refresh token"
    });

  }

};



// ===================== LOGOUT =====================

exports.logout = async (req, res) => {

  res.json({
    message: "User logged out successfully"
  });

};