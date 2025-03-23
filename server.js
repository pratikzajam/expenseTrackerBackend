import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './src/routes/route.js';
import connectDB from './dbConnection.js';

dotenv.config(); 

const app = express();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://your-frontend-deployed.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, 
}));


app.options('*', cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});


app.use(express.json());
app.use('/', routes);


connectDB();


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
