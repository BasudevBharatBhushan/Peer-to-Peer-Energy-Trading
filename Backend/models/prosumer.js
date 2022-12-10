const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var prosumerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  publicAddress: {
    type: String,
    required: true,
    trim: true,
  },
  prosumerId: {
    type: Number,
    default: 0,
  },
  aadharId: {
    type: Number,
    default: 0,
  },
  maticBalance: {
    type: Number,
    default: 0,
  },
  energyBalance: {
    type: Number,
    default: 0,
  },
  role: {
    type: Number, //The higher the number the more privilages you are having
    default: 0,
  },
  encry_password: {
    type: String,
    required: true,
  },
  salt: String,
});

prosumerSchema
  .virtual("password") //Actually encry_password is being stored, "password" is just used for reference
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

prosumerSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) == this.encry_password;
  },
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("Prosumer", prosumerSchema);
