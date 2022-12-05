const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getProsumerById, getProsumer } = require("../controllers/prosumer");

const {
  getCardById,
  createCard,
  getAllCard,
  removeCard,
} = require("../controllers/card");

//params
router.param("prosumerId", getProsumerById);
router.param("cardId", getCardById);

//Actual Routes

//Create
router.post(
  "/card/create/:prosumerId",
  isSignedIn,
  isAuthenticated,
  createCard
);

//Read

//Get all cards

router.get("/card/all", getAllCard);

//Get specific card

router.get("/card/:cardId", getCardById);

//Delete Card
router.delete(
  "/card/:cardId/:prosumerId",
  isSignedIn,
  isAuthenticated,
  removeCard
);

module.exports = router;
