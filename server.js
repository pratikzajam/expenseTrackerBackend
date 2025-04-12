import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';

dotenv.config();

const app = express();

// ✅ List of allowed origins (local + Vercel frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://expense-tracker-plum-omega-26.vercel.app"
];

// ✅ CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Preflight requests handler
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use('/', routes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
