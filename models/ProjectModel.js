const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the project schema
const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    progress: {
        type: Number, 
        required: true,
        min: 0,
        max: 100,
    },
    startDate: {
        type: Date, 
        required: true,
    },
    endDate: {
        type: Date, 
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        default: null, // No category initially
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
