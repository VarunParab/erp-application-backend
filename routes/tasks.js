const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    getTaskByID,
} = require('../controllers/taskcontroller');

router.get('/', getAllTasks);
router.post('/',createTask);
router.get('/:id', getTaskByID);
router.delete('/:id',deleteTask);
router.patch('/:id', updateTask);


module.exports = router;