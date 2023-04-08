const { Genre, validator } = require('../models/genre')
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorize');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validObjectId = require('../middleware/validObjectId');


router.get('/', asyncMiddleware(async (req, res) => {
    // throw new Error("Could not find genres");
    const genres = await Genre.find().sort('name');
    res.send(genres)
}));

router.get('/:id', validObjectId, asyncMiddleware(async (req, res) => {
    let genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = new Genre({ name: req.body.name });

    await genre.save();
    res.send(genre);
}));

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const result = validator(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { returnDocument: 'after' });

    if (!genre) return res.status(404).send("Genre Not Found");
    res.send(genre);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).send("Genre Not Found");

    res.send(genre);
}));



module.exports = router;