import { MongoClient } from 'mongodb';

const uri = 'your_mongodb_connection_string_here'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const connectDB = async () => {
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};