import mongoose from 'mongoose';

// TODO: consider just using the mongoose connection object directly
class MongooseConnection {

    constructor(private mongoUrl: string) {
    }

    async connect() {
        console.log('Connecting to MongoDB:', this.mongoUrl);

        await mongoose.connect(this.mongoUrl);

        console.log('Connected to MongoDB. Readystate: ', mongoose.connection.readyState);
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}

export { MongooseConnection };