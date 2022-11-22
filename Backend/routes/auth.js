var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    //Express-validator
    check("name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check(
      "publicAddress",
      "Please enter a proper Ethereum Wallet Address"
    ).isLength({ min: 42 }),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup //controller
);

router.post(
  "/signin",
  [
    //Express-validator
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({
      min: 1,
    }),
  ],
  signin //controller
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
