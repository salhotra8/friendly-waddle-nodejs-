const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const asyncMiddleware = require('../middleware/async');


router.post('/',asyncMiddleware( async (req, res) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Email or Password");

    const validPasssword = await bcrypt.compare(req.body.password, user.password);
    if(!validPasssword) return res.status(400).send("Invalid Email or Password");

    const token = user.generateAuthToken();
    res.send(token)
}));

function validator(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user)
}

module.exports = router;

