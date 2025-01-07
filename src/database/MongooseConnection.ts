import mongoose from 'mongoose';

// TODO: consider just using the mongoose connection object directly
class MongooseConnection {

    constructor(private mongoUrl: string) {
    }

    async connect() {
        await mongoose.connect(this.mongoUrl);
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}

export { MongooseConnection };