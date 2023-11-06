const express = require('express');

require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose');
const dburl = process.env.dburl;
const PORT = process.env.PORT || 3002;

const reclamationsRouter = require('./routers/reclamations');
const usersRouter = require('./routers/users');
const authRouter = require('./routers/auth');
const app = express();
app.use(cors());





app.use(cors());



// Middlewares
app.use(express.json());


// using routers
app.use('/api/reclamations', reclamationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);


mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

