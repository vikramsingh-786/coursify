const paymentModel = require('../models/Payment.model');
const userModel = require("../models/User.js");
const AppError = require("../utils/error.utils.js");
const { razorpay } = require("../config/razorpay");
const crypto = require('crypto');

// Get Razorpay API key
const getRazorPayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Razorpay API Key",
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

const buySubscription = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const user = await userModel.findById(userId);

        if (!user) {
            return next(new AppError("User not found, please login again", 404));
        }
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase a subscription", 400));
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 1,
        });


        if (subscription.status === 'created') {
            user.subscription.status = 'created';
        } else {
            user.subscription.status = subscription.status;
        }

        user.subscription.id = subscription.id;
        user.subscription.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscribed Successfully",
            subscription_id: subscription.id,
        });
    } catch (e) {
        console.error("Error:", e);
        return next(new AppError(e.message, 500));
    }
};


const verifySubscription = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { razorpay_payment_id, razorpay_signature } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return next(new AppError("Unauthorized, please login", 401));
        }

        const subscriptionId = user.subscription.id;
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${subscriptionId}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return next(new AppError("Payment Not Verified, please try again", 400));
        }

        user.subscription.status = "active";
        user.subscription.expiryDate = new Date(Date.now() + 30*24*60*60*1000);  

        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
        });
    } catch (e) {
        console.error("Error during payment verification:", e);
        return next(new AppError(e.message, 500));
    }
};

const cancelSubscription = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return next(new AppError("Unauthorized, please login", 401));
      }
  
      if (user.role === "admin") {
        return next(new AppError("Admin cannot cancel subscriptions", 400));
      }
  
      const subscriptionId = user.subscription.id;
  
      const razorpaySubscription = await razorpay.subscriptions.fetch(subscriptionId);
      const razorpayStatus = razorpaySubscription.status;

      if (razorpayStatus === "inactive" || razorpayStatus === "cancelled") {
        return next(new AppError("Subscription is already inactive or canceled.", 400));
      }
  
      if (razorpayStatus === "completed") {
        user.subscription.status = "inactive"; 
        user.subscription.id = undefined; 
        user.subscription.expiryDate = null; 
  
        await user.save();

        return res.status(200).json({
          success: true,
          message: "Subscription marked as inactive successfully due to completion status.",
        });
      }

      if (razorpayStatus === "active") {
        const razorpayCancel = await razorpay.subscriptions.cancel(subscriptionId);
  
        console.log("Razorpay Cancellation Response:", razorpayCancel);
  
        if (razorpayCancel.status === "cancelled") {
          user.subscription.status = "inactive"; 
          user.subscription.expiryDate = null; 
          user.subscription.id = undefined; 

          await user.save();
          return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully.",
          });
        } else {
          return next(new AppError("Failed to cancel subscription in Razorpay", 400));
        }
      } else {
        return next(new AppError("Subscription is not active and cannot be cancelled.", 400));
      }
    } catch (error) {
      console.error("Error during cancellation:", error);
      return next(new AppError(error.message || error.error.description, error.statusCode || 500));
    }
  };


const allPayments = async (req, res, next) => {
    try {
        const { count } = req.query;

        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
        });

        res.status(200).json({
            success: true,
            message: "All Payments",
            allPayments: subscriptions,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

module.exports = {
    getRazorPayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments,
};

