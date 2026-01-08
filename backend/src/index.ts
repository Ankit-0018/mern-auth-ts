import express from 'express';
import 'dotenv/config';
import { API_ORIGIN, PORT } from './constants/env';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import { OK } from './constants/http';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin : API_ORIGIN,
        credentials : true
    }
))
app.use(cookieParser());

app.get('/', (req , res) => {
    res.status(OK).json({
        status : "healthy"
    })
})

app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
})