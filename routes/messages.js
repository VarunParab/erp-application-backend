const express = require('express');
const protectRoute = require('../middleware/userMiddleware.js')
const {getUsersForSidebar,getMessages,sendMessage} = require('../controllers/messagecontoller.js');
const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;