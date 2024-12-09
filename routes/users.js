const express = require('express');
const {
    signup,
    login,
    logout,
    check,
    updateProfile,
} = require('../controllers/usercontroller.js');// import { protectRoute } from "../middleware/auth.middleware.js";
const protectRoute = require('../middleware/userMiddleware.js')
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, check);
router.put("/update-profile", protectRoute, updateProfile);

// router.get("/check", protectRoute, checkAuth);

module.exports = router;