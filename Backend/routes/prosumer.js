const express = require("express");
const router = express.Router();

const {
  getProsumerById,
  getProsumer,
  updateProsumer,
  getAllProsumer,
} = require("../controllers/prosumer");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("prosumerId", getProsumerById);

router.get("/prosumer/all", getAllProsumer);

// router.get("/prosumer/:prosumerId", isSignedIn, isAuthenticated, getProsumer);
router.get("/prosumer/:prosumerId", getProsumer);

router.put(
  "/prosumer/:prosumerId",
  // isAdmin,
  // isSignedIn,
  // isAuthenticated,
  updateProsumer
);

module.exports = router;
