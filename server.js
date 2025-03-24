import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-tracker-plum-omega-26.vercel.app",
  "https://expense-tracker-backend-rosy-iota.vercel.app"
];

// ✅ Apply CORS Middleware Before Routes
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, 
}));

// ✅ Allow Preflight Requests (Important)
app.options("*", cors());

app.use(express.json());

// ✅ Define Routes AFTER CORS Middleware
app.use('/', routes);

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
