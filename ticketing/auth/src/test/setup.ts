//We want to start up a copy of Mongo DB in memory. This allows us to run multiple different test suites at the same time across different projects
//without them all trying to raech out the same copy of Mongo. Mongo memory server also gives us direct memory access to the small DB database.
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';

let mongo: any;
//running beforeALl codes before running the tests
beforeAll(async () => {
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