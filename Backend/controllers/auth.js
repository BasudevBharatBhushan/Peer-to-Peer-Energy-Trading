require("dotenv").config();
const Prosumer = require("../models/prosumer");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

/*
    While SignUp I want to take 4 fields
    1. Name
    2. Email
    3. Public Address Metamask
    4. Password
*/

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const prosumer = new Prosumer(req.body);
  prosumer.save((err, prosumer) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save prosumer in DB",
      });
    }
    res.json({
      //If prosumer is saved successfully, then return these fields in form of json
      name: prosumer.name,
      email: prosumer.email,
      publicAddress: prosumer.publicAddress,
      id: prosumer._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body; //Destructuring

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  Prosumer.findOne({ email }, (err, prosumer) => {
    if (err || !prosumer) {
      return res.status(400).json({
        error: "PROSUMER email does not exists",
      });
    }
    if (!prosumer.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: prosumer._id }, process.env.SECRET);

    //Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role, publicAddress } = prosumer;
    return res.json({
      token,
      prosumer: { _id, name, email, publicAddress, role },
    });
  });
};

exports.signout = (req, res) => {
  //Clear the Cooky
  res.clearCookie("token");

  res.json({
    message: "Prosumer signout successfully",
  });
};

/*------PROTECTED ROUTES---------------------------------------------------------------------------------------------------*/

/* 1. IsSignedIN   */

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
}); //Here we are not writing next even being a middleware because expressJWt has already got that covered

//Custom Middlewares

/* 2. IsAuthenticated   */

exports.isAuthenticated = (req, res, next) => {
  //req.profile is being check by the frontend & req.auth is being checked by expressJWT
  console.log("Reached auth controller");
  console.log(req.profile);
  // let checker =
  // req.body && req.auth && req.body.values.listProsumer._id == req.auth._id;

  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

/* 3. IsAdmin  */

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied",
    });
  }

  next();
};
