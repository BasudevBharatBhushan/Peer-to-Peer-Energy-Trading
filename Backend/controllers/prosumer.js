const Prosumer = require("../models/prosumer");

/*------------------Middleware--------------------- */
exports.getProsumerById = (req, res, next, id) => {
  console.log("Get Prosumer by ID triggered...");
  Prosumer.findById(id).exec((err, prosumer) => {
    if (err || !prosumer) {
      return res.status(400).json({
        error: "No prosumer was found in DB",
      });
    }
    req.profile = prosumer;
    next();
  });
};

/*---------------------------------------*/

exports.getProsumer = (req, res) => {
  //Do not return these fields to the frontend
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.getAllProsumer = (req, res) => {
  Prosumer.find()
    .populate("user", "_id name")
    .exec((err, prosumer) => {
      if (err) {
        return res.status(400).json({
          error: "No Card found in DB",
        });
      }
      res.json(prosumer);
    });
};

exports.updateProsumer = (req, res) => {
  Prosumer.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, prosumer) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this prosumer",
        });
      }
      prosumer.salt = undefined;
      prosumer.encry_password = undefined;
      res.json(prosumer);
    }
  );
};
