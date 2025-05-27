import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,   
    credentials: true, // Allow cookies to be sent with requests
}))
app.use(express.json({limit:'16kb'})); // Parse JSON bodies with a limit of 16kb

export default app;