const Course = require('../models/Course.model.js');
const User = require('../models/User.js');
const AppError = require('../utils/error.utils');
const sendEmail = require('../utils/sendEmail.js');

// Backend: contactUs function
const contactUs = async (req, res, next) => {
    const { name, email, message, inquiryType } = req.body;

    if (!name || !email || !message || !inquiryType) {
        return next(new AppError("All fields are required", 400));
    }

    try {
    
        const ownerEmailMessage = `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\nMessage: ${message}`;

        await sendEmail(
            process.env.CONTACT_US_EMAIL, 
            "New Inquiry Received",
            ownerEmailMessage,
        );

      
        const userMessage = `Hello ${name},\n\nThank you for contacting us! We have received your message and will get in touch with you soon.\n\nBest regards,\nThe Learning Team 😊`;

        await sendEmail(
            email, 
            'Thank You for Contacting Us',
            userMessage,
        );

        res.status(200).json({
            success: true,
            message: "Thanks for contacting. We have sent you a confirmation email and will get in touch with you soon.",
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


const stats = async (req, res, next) => {
    try {
        // Fetch all users and filter them by role 'user', excluding passwords
        const allUsers = await User.find({ role: 'user' }).select('-password');
        const allUsersCount = allUsers.length;
        
        // Get the count of users with active subscriptions
        const subscribedUsersCount = allUsers.filter((user) => user.subscription.status === 'active').length;

        // Fetch all courses and populate lessons
        const allCourses = await Course.find().populate('lessons');
    
        // Calculate total number of videos (lessons)
        const totalVideos = allCourses.reduce((total, course) => {
            return total + (course.numberOfLessons || 0);
        }, 0);

        res.status(200).json({
            success: true,
            message: 'Stats retrieved successfully',
            stats: {
                allUsersCount,
                subscribedUsersCount,
                totalCourses: allCourses.length,
                totalVideos,
                courses: allCourses
            }
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

module.exports = { contactUs, stats };
