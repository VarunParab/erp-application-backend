const Task = require('../models/TaskModel');
const mongoose = require('mongoose');
//get all tasks
const getAllTasks = async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json(tasks);
}

//get a single task
const getTaskByID = async (req, res) => {
    try {
      const taskId = req.params.id;  // Assuming the ID is passed as a URL parameter
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json(task);
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

//create a new Task
const createTask = async (req,res) => {
    const {taskName,status,project,dueDate,assignee} = req.body
    try{
    const task=await Task.create({taskName,status,project,dueDate,assignee});
    res.status(200).json(task);
    }catch(err){
        res.status(400).json({message: err.message});
    }
}

//Delete a Task
const deleteTask = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){ 
        return res.status(404).json({message: 'no such tasks'});
    }
    const task=await Task.findOneAndDelete({_id:id});
    if(!task){
        return res.status(404).json({message: 'no such tasks'});
    }
    console.log(`${task._id}`)
    res.status(200).json(task);
}

//update a Task
const updateTask = async (req, res) => {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(404).json({ message: 'No such task found' });
    }

    try {
        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...req.body }, // Spread the fields to update
            { new: true, runValidators: true } // Return updated document and run schema validators
        );

        // If no task is found with the given ID
        if (!updatedTask) {
            return res.status(404).json({ message: 'No such task found' });
        }

        res.status(200).json(updatedTask); // Send back the updated task
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'Failed to update the task', error: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    getTaskByID,
}