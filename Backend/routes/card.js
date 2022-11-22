const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getProsumerById, getProsumer } = require("../controllers/prosumer");

const { getCardById, createCard, getAllCard } = require("../controllers/card");

//params
router.param("prosumnerId", getProsumerById);
router.param("cardId", getCardById);

//Actual Routes

//Create
router.post(
  "/card/create/:proumserId",
  isSignedIn,
  isAuthenticated,
  createCard
);

//Read

//Get all cards

router.get("/card/all", getAllCard);

//Get specific card

router.get("/card/:cardId", getCardById);

module.exports = router;
