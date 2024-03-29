//We want to start up a copy of Mongo DB in memory. This allows us to run multiple different test suites at the same time across different projects
//without them all trying to raech out the same copy of Mongo. Mongo memory server also gives us direct memory access to the small DB database.
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';

declare global {
	var signin: () => Promise<string[]>;
}

let mongo: any;
//running beforeALl codes before running the tests
beforeAll(async () => {
    process.env.JWT_KEY = 'whateverstring';

    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    //before each test, delete all collections/data inside Mongo
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

//create global scope to reuse for every test files
global.signin = async () => {
    //sign up first
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};