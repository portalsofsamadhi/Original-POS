import express from 'express';
import { connectDB } from './config/db';
import { setApiRoutes } from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Set up API routes
setApiRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});