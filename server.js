
import express from 'express';
import 'dotenv/config'
import routes from './src/routes/route.js'
import connectDB from './dbConnection.js';
import cors from 'cors'

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);


connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});