import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import cart from "./routes/cart.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/cart', cart);

app.listen(8080, () => {
    console.log('Example app listening on port 3000!');
});