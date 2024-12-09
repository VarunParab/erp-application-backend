const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const taskRoutes = require('./routes/tasks')
const categoryRoutes = require('./routes/categories')
const messageRoutes = require('./routes/messages')
const userRoutes = require('./routes/users')
const {MongoClient} =require('mongodb');
const {app,server} = require('./lib/socket');
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());
// app.get('/',(req, res) => {
//     res.json('success');
// });
app.use('/tasks',taskRoutes)
app.use('/category',categoryRoutes)
app.use('/user',userRoutes) //user routes are not required for this task, so commenting it out for now. Uncomment it when you have user routes.
app.use('/messages',messageRoutes)
mongoose.connect(process.env.uri)
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));
server.listen(process.env.PORT, ()=>{
    console.log('Server is running on port 4000...');
});