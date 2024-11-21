const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const taskRoutes = require('./routes/tasks')
const {MongoClient} =require('mongodb');
const app = express();
app.use(express.json());
app.use(cors());
// app.get('/',(req, res) => {
//     res.json('success');
// });
app.use('/tasks',taskRoutes)
mongoose.connect(process.env.uri)
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));
app.listen(process.env.PORT, ()=>{
    console.log('Server is running on port 4000...');
});