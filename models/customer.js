const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
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

});

const Customer = mongoose.model('Customer', customerSchema);


function validator(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(10).required()
    });

    return schema.validate(customer)
}

module.exports.Customer = Customer;
module.exports.validator = validator
