import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import UserRouter from './Routes/UserRouter.js';
import AdminRouter from './Routes/AdminRouter.js';
import AppError from './Utils/AppError.js';
import globalErrorHandler from './Middleware/errorMiddleware.js';
import passport from 'passport';
import './Utils/passport.js';

// Fix for Windows / ISP DNS SRV lookup ECONNREFUSED issues on mongodb+srv://
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn("DNS server setup warning:", dnsErr.message);
}

const app = express();

dotenv.config({ quiet: true });

app.set('trust proxy', 1);


app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["*", "data:", "blob:"],
                connectSrc: ["*"],
            },
        },
    })
);


const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

const allowedOrigins = [
    'https://eventify-frontend-six-xi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10kb' }));
app.use(passport.initialize());





const DB = process.env.DATABASE;

mongoose.connect(DB)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        console.log("not connected to MongoDB");
    });

app.use('/user', UserRouter);
app.use('/admin', AdminRouter);


app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler);

export default app;