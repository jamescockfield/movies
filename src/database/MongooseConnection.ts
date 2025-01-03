import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

class MongooseConnection {

    mongod: MongoMemoryServer | undefined;

    async connectToMemoryDB() {
        this.mongod = await MongoMemoryServer.create();
        const uri = this.mongod.getUri();
        await mongoose.connect(uri);
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}

export { MongooseConnection };