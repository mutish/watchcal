import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {Pool} from 'pg';

import authroutes from './src/routes/authroutes.js';


const app = express()
dotenv.config();

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

pool.connect((err, client, release) => {
    if(err){
        console.error('Check your connection :(', err.stack);
    }else {
        console.log('Postgres says things are looking good');
        release();
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status:'ok',
        message:'Server is 200'
    })
});

app.use('/api/auth', authroutes);

// app.get('/api/media', async(req, res) => {
//     try{
//         const {search, type } = req.query;
//         let query = 'SELECT * FROM media';
//         const params = [];
//          if (search || type){
//             query += ' WHERE';
//             if(search){
//                 params.push(`%${search}`);
//                 query += `title ILIKE $${params.length}`;
//          }
//          if (type){
//             if(search) query += ' AND';
//             params.push(type);
//             query += `media_type = $${params.length}`;
//          }
//     }
//     query += ' ORDER BY created_at DESC';

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//     } catch(err) {
//     console.error('Error fetching media:', err);
//     res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.post('/api/echo', (req, res) => {
    const { message } = req.body;
    res.status(200).json({
        echo: message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
