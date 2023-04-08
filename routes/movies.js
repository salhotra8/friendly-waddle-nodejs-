const { Movie, validator } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');


router.get('/', asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    let movie = Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie Not Found");
    res.send(movie);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invaid Genre");

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { returnDocument: 'after' });

    if (!movie) return res.status(404).send("movie Not Found");
    res.send(movie);
}));;

router.delete('/:id', asyncMiddleware(async (req, res) => {
    const movie = await movie.findByIdAndDelete(req.params.id);

    if (!movie) return res.status(404).send("Movie Not Found");

    res.send(movie);
}));

module.exports = router;
