const Joi = require('joi');
const mongoose = require('mongoose');
const dayjs = require('dayjs');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 4,
                maxlength: 20
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 10
            },
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 300
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateRented: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookUp = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });

}

rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = dayjs(this.dateReturned).diff(this.dateRented, 'day');
    this.rentalFee = this.movie.dailyRentalRate * rentalDays;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validator(rental) {
    const schema = Joi.object({
        customerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        movieId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
    return schema.validate(rental)
}

module.exports.Rental = Rental;
module.exports.validator = validator;