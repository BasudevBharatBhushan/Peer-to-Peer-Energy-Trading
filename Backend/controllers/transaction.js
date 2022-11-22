const Transaction = require("../models/transaction");

exports.getTransactionById = (req, res, next, id) => {
  Transaction.findById(id).exec((err, transaction) => {
    if (err) {
      return res.status(400).json({
        error: "No Transaction found in DB",
      });
    }
    req.transaction = transaction;
    next();
  });
};

exports.createTransaction = (req, res) => {
  req.body.transaction.prosumer = req.profile;

  const transaction = new Transaction(req.body.transaction);
  transaction.save((err, transaction) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save transaction in DB",
      });
    }
    res.json(transaction);
  });
};

exports.getAllTransaction = (req, res) => {
  Transaction.find()
    .populate("user", "_id name")
    .exec((err, transaction) => {
      if (err) {
        return res.status(400).json({
          error: "No Transaction found in DB",
        });
      }
      res.json(transaction);
    });
};
