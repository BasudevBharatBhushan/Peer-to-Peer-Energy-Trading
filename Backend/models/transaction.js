const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  txnDate: {
    type: Date,
  },
  tokenSender: {
    type: ObjectId,
    ref: "Prosumer",
  },
  tokenReceiver: {
    type: ObjectId,
    ref: "Prosumer",
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
  senderTokenBalance: {
    //Balance during the time of transaction
    type: Number,
    required: true,
  },
  receiverTokenBalance: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

//Transaction Type
// Sold Energy
// Bought Energy
