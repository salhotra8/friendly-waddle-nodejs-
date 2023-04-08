const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 300
    },
    genre: {
        type: genreSchema,
        ref: 'Genre'
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255

    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255

    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validator(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(1).max(40),
        genreId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });
    return schema.validate(movie)
}

module.exports.Movie = Movie;
module.exports.validator = validator;