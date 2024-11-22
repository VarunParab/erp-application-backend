const Task = require('../models/TaskModel');
const mongoose = require('mongoose');
//get all tasks
const getAllTasks = async (req, res) => {
    const tasks = await Task.find({})
    res.status(200).json(tasks);
}

//create a new Task
const createTask = async (req,res) => {
    const {category,content,label,dueDate} = req.body
    try{
    const task=await Task.create({category,content,label,dueDate});
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
const updateTask = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)){ 
        return res.status(404).json({message: 'no such tasks'});
    }
    const task = await Task.findByIdAndUpdate({_id:id}, {
       ...req.body,
    })

    if(!task){
        return res.status(404).json({message: 'no such tasks'});
    }
    res.status(200).json(task);
}

module.exports = {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask
}