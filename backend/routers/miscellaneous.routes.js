const express = require('express');
const router = express.Router();
const { contactUs,stats } = require('../controllers/miscellaneous.controller.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const roleCheck = require('../middleware/roleCheck.middleware.js');


router.post("/contact", contactUs);
router.get("/admin/stats/users", authMiddleware, roleCheck(["admin"]), stats);

module.exports = router;


