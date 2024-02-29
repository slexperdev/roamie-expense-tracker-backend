const db = require("../config/mongo.init");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.checkLogin = (req, res) => {
  let refreshId = req.body.userId + process.env.JWT_SECRET;
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(refreshId)
    .digest("base64");
  req.body.refreshKey = salt;
  let token = jwt.sign(req.body, process.env.JWT_SECRET);
  let b = Buffer.from(hash);

  db.user
    .find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length !== 0) {
        // Generate a unique reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        db.user
          .findOneAndUpdate(
            { email: req.body.email },
            {
              $set: {
                resetToken: resetToken,
              },
            },
            { new: true }
          )
          .then((updatedUser) => {
            if (updatedUser != null) {
              res.status(200).send({
                status: true,
                message: "User reset token updated.",
                data: updatedUser,
                token,
              });
            } else {
              res.status(400).send({
                status: false,
                message: "User reset token update failed.",
              });
            }
          });
      } else {
        res.status(404).send({ status: false, message: "No such user" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ status: false, message: "Internal server error" });
    });
};

exports.saveNewUser = (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;

  const user = new db.user({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    currency: req.body.currency,
  });
  user.save().then((r) => {
    if (r.length !== 0) {
      res.status(200).send({ status: true, user });
    } else {
      res.status(400).send({ status: false });
    }
  });
};
