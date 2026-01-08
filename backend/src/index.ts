import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';


const app = express();

app.get('/', (req , res) => {
    res.status(200).json({
        status : "healthy"
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
})