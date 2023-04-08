// return 401 if client is not logged in
// return 400 if customerid is not given 
// return 400 if movieid is not given 
// return 404 if rental on found for this customer/movie
// return 400 if rental already processed
// return 200 if it is valid request
// Set the return date 
// calculate rental fee
// increase the stock
// return the rental

const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const request = require('supertest');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const dayjs = require('dayjs');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let token;
    let rental;
    let movie;


    const exce = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth', token)
            .send({ customerId, movieId });

    };

    beforeEach(async () => {
        server = require('../../index');
        token = new User().generateAuthToken();
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        movie = {
            _id: movieId,
            title: '12456',
            dailyRentalRate: 2
        }

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '0123456789',
            },
            movie: movie
        });
        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await server.close();
    });

    test('Should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exce();

        expect(res.status).toBe(401);
    });

    test('Should return 400 if customerId not provided', async () => {
        customerId = '';

        const res = await exce();

        expect(res.status).toBe(400);
    });

    test('Should return 400 if movieId not provided', async () => {

        movieId = '';

        const res = await exce();

        expect(res.status).toBe(400);
    });

    test('Should return 404 if rental not found for given customer/movie', async () => {
        await Rental.deleteMany({});

        const res = await exce();

        expect(res.status).toBe(404);
    });

    test('Should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exce();

        expect(res.status).toBe(400);
    });

    test('Should return 200 if it is valid request', async () => {

        const res = await exce();

        expect(res.status).toBe(200);
    });

    test('Should set dateReturned if input is valid', async () => {
        const res = await exce();

        const rentalInDb = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000)
    });

    test('Should set rentalFee if input is valid', async () => {
        rental.dateRented = dayjs().subtract(7, 'days');
        await rental.save();

        await exce();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });

    test('Should increase the movie stock if input is valid', async () => {
        let movieObj = new Movie({
            ...movie,
            numberInStock: 10,
            genre: { name: '12345' }

        })
        await movieObj.save();

        await exce();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movieObj.numberInStock + 1);
    });

    test('Should return rental if input is valid', async () => {
        const res = await exce();

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'movie',
            'customer',
            'dateReturned',
            'dateRented',
            'rentalFee'
        ]));
    });


})