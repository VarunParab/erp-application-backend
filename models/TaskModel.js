const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    label:{
        type: String,
        required: true,
    },
    dueDate:{
        type: String,
        required: true,
    }
},{timestamps: true});


module.exports = mongoose.model('Task', taskSchema);