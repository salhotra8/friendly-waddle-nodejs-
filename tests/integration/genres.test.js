const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });


    describe('GET /', () => {
        test('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy();
        });
    });


    describe('GET /:id', () => {
        test('Should return genre matching the given valid id', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        test('Should return 404 if invalid id is passed', async () => {

            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });

        test('Should return 404 if genre not found', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            let id = new mongoose.Types.ObjectId();

            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });

    });

    describe('POST /', () => {

        let token;
        let name;

        const exce = () => {
            return request(server)
                .post('/api/genres')
                .set("x-auth", token)
                .send({ name: name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })


        test('Should return 401 if user not logged in', async () => {
            token = '';

            const res = await exce();

            expect(res.status).toBe(401);
        });

        test('Should return 400 if genre is length is less than 4 characters', async () => {
            name = 'gen'

            const res = await exce();

            expect(res.status).toBe(400);
        });

        test('Should return 400 if genre is length is greater than 20 characters', async () => {
            name = new Array(22).join('a');

            const res = await exce();

            expect(res.status).toBe(400);
        });

        test('Should save the genre if it is valid', async () => {
            await exce();

            const genre = await Genre.find({ name: 'genre1' })

            expect(genre).not.toBeNull();
        });

        test('Should return the genre if it is valid', async () => {

            const res = await exce();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');

        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let genre;
        let id;

        const exce = () => {
            return request(server)
                .put('/api/genres/' + id)
                .set("x-auth", token)
                .send({ name: name });
        }

        beforeEach(async () => {
            token = new User().generateAuthToken();
            name = 'genre1';
            genre = new Genre({ name: name });
            id = genre._id;
            await genre.save();
        })


        test('Should return 401 if user not logged in', async () => {
            token = '';

            const res = await exce();

            expect(res.status).toBe(401);
        });

        test('Should return 404 if genre not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exce();

            expect(res.status).toBe(404);
        });

        test('Should return 404 if invalid id is passed', async () => {
            id = '';

            const res = await exce();

            expect(res.status).toBe(404);
        });

        test('Should return 400 if genre is length is less than 4 characters', async () => {
            name = 'gen'

            const res = await exce();

            expect(res.status).toBe(400);
        });

        test('Should return 400 if genre is length is greater than 20 characters', async () => {
            name = new Array(22).join('a');

            const res = await exce();

            expect(res.status).toBe(400);
        });

        test('Should update the genre if it is valid', async () => {
            name = 'genre2';

            const res = await exce();

            expect(res.body).toHaveProperty('name', name)
        });

    });


    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        const exce = () => {
            return request(server)
                .delete('/api/genres/' + id)
                .set("x-auth", token);
        }

        beforeEach(async () => {
            const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
            const user = new User(payload);
            token = new User(user).generateAuthToken();
            genre = new Genre({ name: 'genre1' });
            id = genre._id;
            await genre.save();
        })


        test('Should return 401 if user not logged in', async () => {
            token = '';

            const res = await exce();

            expect(res.status).toBe(401);
        });

        test('Should return 403 if user not admin', async () => {
            token = new User().generateAuthToken();

            const res = await exce();

            expect(res.status).toBe(403);
        });

        test('Should return 404 if invalid id is passed', async () => {
            id = '';

            const res = await exce();

            expect(res.status).toBe(404);
        });

        test('Should return 404 if genre not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exce();

            expect(res.status).toBe(404);
        });

        test('Should return deleted the genre', async () => {
            const res = await exce();

            expect(res.body).toHaveProperty('name', 'genre1');
            expect(res.body).toHaveProperty('_id', id.toHexString());
        });
    });

});

