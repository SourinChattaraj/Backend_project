import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,   
    credentials: true, // Allow cookies to be sent with requests
}))
app.use(express.json({limit:'16kb'})); // Parse JSON bodies with a limit of 16kb
app.use(express.urlencoded({extended: true, limit:'16kb'})); // Parse URL-encoded bodies with a limit of 16kb
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies from the request headers

// routes
import userRoutes from './routes/user.route.js';

app.use('/api/v1/users', userRoutes)

export default app;