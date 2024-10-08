const Card = require("../models/card");

exports.getCardById = (req, res, next, id) => {
  console.log(id);
  Card.findById(id).exec((err, card) => {
    if (err) {
      return res.status(400).json({
        error: "No Card found",
      });
    }
    req.card = card;
    console.log(req.card);
    next();
  });
};

exports.createCard = (req, res) => {
  console.log("Reached card controller");
  console.log(req.body);
  const card = new Card(req.body);
  card.save((err, card) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save card in DB",
      });
    }
    res.json(card);
  });
};

exports.getAllCard = (req, res) => {
  Card.find()
    .populate("user", "_id name")
    .exec((err, card) => {
      if (err) {
        return res.status(400).json({
          error: "No Card found in DB",
        });
      }
      res.json(card);
    });
};

exports.removeCard = (req, res) => {
  const card = req.card;

  card.remove((err, deletedCard) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the card",
      });
    }
    res.json({
      message: `$card successfully deleted`,
    });
  });
};

exports.updateCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.card._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, card) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to Update the Card",
        });
      }
      res.json(card);
    }
  );
};
