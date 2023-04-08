const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const auth = require('../middleware/authorize');
const dayjs = require('dayjs');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validator)], async (req, res) => {
    let rental = await Rental.lookUp(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send("Rental not found")
    if (rental.dateReturned) return res.status(400).send("Return already processed");

    rental.return();

    rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })

    rental = await Rental.findById(rental._id)

    return res.send(rental);

});

function validator(rental) {
    const schema = Joi.object({
        customerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        movieId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
    return schema.validate(rental)
}

module.exports = router;        