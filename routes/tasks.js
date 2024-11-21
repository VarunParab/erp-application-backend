const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
} = require('../controllers/taskcontroller');

router.get('/', getAllTasks);
router.post('/',createTask);
router.delete('/:id',deleteTask);
router.patch('/:id', updateTask);


module.exports = router;