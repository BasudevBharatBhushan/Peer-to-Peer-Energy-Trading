const express = require("express");
const router = express.Router();

const {
  getProsumerById,
  getProsumer,
  updateProsumer,
} = require("../controllers/prosumer");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("prosumerId", getProsumerById);

router.get("/prosumer/:prosumerId", isSignedIn, isAuthenticated, getProsumer);
router.put(
  "/prosumer/:prosumerId",
  isSignedIn,
  isAuthenticated,
  updateProsumer
);

module.exports = router;
