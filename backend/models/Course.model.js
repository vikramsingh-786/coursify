const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    courseCategory: {
      type: String,
      required: true,
    },
    deliveryMode: {
      type: String,
      required: true,
      default: 'Online', 
    },
    prerequisites: {
      type: [String],
      default: [], 
    },
    price: {
      type: Number,
      required: true,
    },
   
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    thumbnail: {
      public_id: String,
      secure_url: String,
    },
    lessons: [
      {
        lessonNumber: Number,
        title: String,
        description: String,
        duration: Number,
        lessonType: String,
        materials: {
          public_id: String,
          secure_url: String,
        },
      },
    ],
    numberOfLessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
