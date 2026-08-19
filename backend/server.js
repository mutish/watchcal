import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express()

// Dynamic import to ensure dotenv is loaded first
//import connectToPostgres from './src/db/connectToPostgres.js';
const connectToPostgres = await import('./src/db/connectToPostgres.js').then(m => m.default);
const authroutes = await import('./src/routes/authroutes.js').then(m => m.default);
const mediaroutes = await import('./src/routes/media.routes.js').then(m => m.default);

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


// Routes to be fetched
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status:'ok',
        message:'Server is 200'
    })
});
app.use("/api/auth", authroutes);
app.use("/api/media",mediaroutes);

app.post('/api/echo', (req, res) => {
    const { message } = req.body;
    res.status(200).json({
        echo: message
    });
});

// Allow frontend connection


// DB connection...
app.listen(PORT, () => {
    connectToPostgres();
    console.log(`Server is running on port ${PORT}`)
})
