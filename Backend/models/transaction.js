const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  txnDate: {
    type: Date,
  },
  producerID: {
    type: Number,
    required: true,
  },
  consumerID: {
    type: Number,
    required: true,
  },
  producerAddress: {
    type: String,
    required: true,
    trim: true,
  },
  consumerAddress: {
    type: String,
    required: true,
    trim: true,
  },
  tokensTransacted: {
    type: Number,
    required: true,
  },
  maticsTransacted: {
    type: Number,
    required: true,
  },
  unitPriceUSD: {
    type: Number,
    required: true,
  },
  unitPriceMatic: {
    type: Number,
    required: true,
  },
  transactionHash: {
    //Will store the blockchain transaction hash
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);

//Transaction Type
// Sold Energy
// Bought Energy
