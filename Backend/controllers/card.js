const Card = require("../models/card");

exports.getCardById = (req, res, next, id) => {
  Card.findById(id).exec((err, card) => {
    if (err) {
      return res.status(400).json({
        error: "No Card found",
      });
    }
    req.card = card;
    next();
  });
};

exports.createCard = (req, res) => {
  req.body.card.prosumer = req.profile;

  const card = new Card(req.body.card);
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
