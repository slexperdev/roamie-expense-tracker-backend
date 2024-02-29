const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/mongo.init");


exports.isPasswordAndUserMatch = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({status: false, data: 'Invalid e-mail'});
    }
    db.user.find({email: req.body.email,}).exec().then((result) => {


        if (!result[0]) {
            res.status(200).send({status: false, data: 'Invalid account'});
        } else {
            let passwordFields = result[0].password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                req.body = {
                    userId: result[0]._id,
                    email: result[0].email,
                    fullName: req.body.fullName,
                };
                return next();
            } else {
                return res.status(200).send({status: false, data: 'Invalid password'});
            }
        }

    });

};

exports.isPasswordsMatched = (req, res, next) => {

    if (!req.body.password) {
        return res.status(200).send({status: false, data: 'Password is required'});
    } else if (!req.body.repeat_password) {
        return res.status(200).send({status: false, data: 'Repeat Password is required'});
    } else if (req.body.password !== req.body.repeat_password)
        return res.status(200).send({status: false, data: 'Passwords are not matched'});
    else
        return next();

};

exports.isUserExist = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({status: false, data: 'Invalid e-mail'});
    } else if (!req.body.fullName) {
        return res.status(200).send({status: false, data: 'Full name is required'});
    }
    db.user.find({email: req.body.email,}).exec().then((result) => {


        if (!result[0]) {
            return next();

        } else {
            res.status(200).send({status: false, data: 'Email already exist'});
        }

    });

};

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({status: false, data: "Unauthorized"});
            } else {
                req.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET);
                return next();
            }

        } catch (err) {
            return res.status(401).send({status: false, data: "Unauthorized"});
        }
    } else {
        return res.status(401).send({status: false, data: "Unauthorized"});
    }
};
