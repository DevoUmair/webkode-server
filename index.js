require('dotenv').config(); 
const express = require('express');
const cors = require('cors')

const app = express();

const allowedOrigins = ['http://localhost:5173'];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        console.log('Incoming request from origin:', origin);
        
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


// Routers
app.get('/', (req, res) => {
    res.send('Hello, Webkode API is working!');
});


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server listen' , port);
});
