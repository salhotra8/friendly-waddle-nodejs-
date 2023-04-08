const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;

describe('Auth middleware', () => {
    let token;
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();

    });
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });

    const exce = () => {
        return request(server)
            .post('/api/genres')
            .set({ "x-auth": token })
            .send({ name: 'genre1' });
    };

    test('Should return 401 if token is not provided', async () => {
        token = '';

        const res = await exce();

        expect(res.status).toBe(401);

    });

    test('Should return 400 if invalid token is provided', async () => {
        token = 'anyInvalidToken';

        const res = await exce();

        expect(res.status).toBe(400);

    });

    test('Should return 200 if valid token is provided', async () => {

        const res = await exce();

        expect(res.status).toBe(200);

    })
})