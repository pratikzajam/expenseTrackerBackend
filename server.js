import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",  // ✅ Add frontend localhost
  "https://expense-tracker-plum-omega-26.vercel.app",
  "https://expense-tracker-backend-rosy-iota.vercel.app"
];

// ✅ Apply CORS Middleware
app.use(cors({
  origin: allowedOrigins,  // Allow multiple origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  credentials: true, // Allow cookies & authentication headers
}));

// ✅ Handle Preflight Requests (OPTIONS)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// ✅ Middleware
app.use(express.json());

// ✅ Define Routes AFTER CORS Middleware
app.use('/', routes);

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
