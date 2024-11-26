const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the project schema
const projectSchema = new Schema({
    projectName: { // Use 'name' instead of 'project' for clarity
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Completed'], // Optional: Add enum for predefined values
    },
    progress: {
        type: Number, // Use Number to allow percentages (e.g., 0-100)
        required: true,
        min: 0,
        max: 100,
    },
    startDate: {
        type: Date, // Use Date type for better date handling
        required: true,
    },
    endDate: {
        type: Date, // Use Date type
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Define the category schema
const categorySchema = new Schema({
    categoryName: { // Category name
        type: String,
        required: true,
        unique: true, // Ensure categories have unique names
    },
    projects: {
        type:[projectSchema],
        default:[], // Default
     } // Array of projects within the category
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
