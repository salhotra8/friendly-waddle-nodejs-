const { Customer, validator } = require('../models/customer');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');


router.get('/', asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers)
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
    let customer = Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer Not Found");
    res.send(customer);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    await customer.save();
    res.send(customer);
}));

router.put('/:id', asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { returnDocument: 'after' });

    if (!customer) return res.status(404).send("customer Not Found");
    res.send(customer);
}));

router.delete('/:id', asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) return res.status(404).send("customer Not Found");

    res.send(customer);
}));


module.exports = router;