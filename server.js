// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';

dotenv.config();

const app = express();

// ✅ Allow all origins dynamically
app.use(cors({
  origin: true, // Reflects the request origin automatically
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Support cookies & authentication
}));

// ✅ Automatically handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Connect to Database
connectDB();

// ✅ Define Routes AFTER middleware
app.use('/', routes);

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
