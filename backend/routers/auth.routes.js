
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require("../middleware/multer.middleware.js");

router.post('/register',upload.single('avatar'), authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile/update',authMiddleware,upload.single("avatar"), authController.updateProfile);
router.put('/profile/change-password', authMiddleware, authController.changePassword);


module.exports = router;



