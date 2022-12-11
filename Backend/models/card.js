const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/* Schema to view the energy listings*/

const CardSchema = new mongoose.Schema({
  listProsumer: {
    type: ObjectId,
    ref: "Prosumer",
    unique: true,
  },
  prosumerID: {
    type: Number,
    required: true,
    default: 0,
  },
  name: {
    type: String,
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
  stakedEnergy: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Card", CardSchema);
