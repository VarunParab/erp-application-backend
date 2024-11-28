const express = require('express');
const router = express.Router();
const {
    getCategoryWithProjects,
    createCategory,
    addProjectToCategory,
    getAllCategories,
    getAllProjects,
    createProjectNoCategory,
    editProject,
    editCategory,
} = require('../controllers/categorycontroller');

router.get('/', getAllCategories);
router.post('/',createCategory);
router.put('/edit', editCategory);
router.put('/projects/:id', editProject);
router.get('/allProjects', getAllProjects);
router.post('/allProjects', createProjectNoCategory);
router.get('/:categoryName', getCategoryWithProjects);
router.post('/:categoryName', addProjectToCategory);
// router.get('/:id', getTaskByID);
// router.delete('/:id',deleteTask);
// router.patch('/:id', updateTask);


module.exports = router;