import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from the backend!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 