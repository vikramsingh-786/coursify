const express = require("express");
const router = express.Router();

const {
  allPayments,
  buySubscription,
  cancelSubscription,
  getRazorPayApiKey,
  verifySubscription,
} = require("../controllers/payment.controller");

const authMiddleware = require("../middleware/auth.middleware"); 
const roleCheck = require("../middleware/roleCheck.middleware.js"); 
router.get("/razorpay-key", authMiddleware, getRazorPayApiKey);

router.post("/subscribe", authMiddleware, buySubscription);

router.post("/verify", authMiddleware, verifySubscription);

router.post("/unsubscribe", authMiddleware, cancelSubscription);

router.get(
  "/",
  authMiddleware,
  roleCheck(["admin"]),
  allPayments
);

module.exports = router;
