const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    project:{
        type: String,
        required: true,
    },
    dueDate:{
        type: String,
        required: true,
    },
    assignee:{
        type: String,
        required: true,
    }
},{timestamps: true});


module.exports = mongoose.model('Task', taskSchema);