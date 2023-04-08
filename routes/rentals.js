const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validator } = require('../models/rental');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');


router.get('/', asyncMiddleware(async (req, res) => {
    const rentals = await Rental.find().sort('-dateRented');
    res.send(rentals);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    let renatal = Rental.findById(req.params.id).sort('-dateRented');
    if (!renatal) return res.status(404).send("Rental Not Found");
    res.send(renatal);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    const customer = await Customer.findById(req.body.customerId);


    if (movie.numberInStock == 0) return res.status(400).send('Moive not available')


    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });
    const db = await mongoose.createConnection('mongodb+srv://nodejs:qzjbwttiCegQfXyG@nodejsdb.9looxxz.mongodb.net/Vidly').asPromise();

    const session = await db.startSession();

    try {
        const transResult = await session.withTransaction(async () => {
            rental = await rental.save({ session });
            if (!rental) {
                await session.abortTransaction();
                console.log('Rental not created');
            }
            await Movie.findByIdAndUpdate(req.body, {
                $inc: { numberInStock: -1 }
            }, { session })
        });
        var transactionResult = transResult;
        if (transResult) {
            console.log('Transaction done');
        } else {
            console.log('Transaction failed');

        }
    }
    catch (err) {
        console.log("Something went wrong and Error is:" + err)
    }
    finally {
        await session.endSession();
        if (transactionResult) res.send(rental);
        else res.status(400).send();
    }
}));

module.exports = router;