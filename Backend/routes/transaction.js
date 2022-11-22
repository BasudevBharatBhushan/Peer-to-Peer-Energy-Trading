const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getProsumerById } = require("../controllers/prosumer");

const {
  getTransactionById,
  createTransaction,
  getAllTransaction,
} = require("../controllers/transaction");

//params

router.param("prosumerId", getProsumerById);
router.param("transactionId", getTransactionById);

//Actual Routes

//Create
router.post(
  "/transaction/create/:prosumerId",
  isSignedIn,
  isAuthenticated,
  createTransaction
);

//Read

//View all transaction
router.get("/transaction/all", getAllTransaction);

//View Specific transaction
router.get("/transaction/:transactionId", getTransactionById);

module.exports = router;
