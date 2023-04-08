const mongoose = require('mongoose');
const Joi = require('joi');


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validator(genre) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(20).required(),
    });

    return schema.validate(genre)
}

module.exports.Genre = Genre;
module.exports.validator = validator;
module.exports.genreSchema = genreSchema;