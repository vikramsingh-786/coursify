const CourseModel = require('../models/Course.model.js');
const AppError = require('../utils/error.utils.js');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary.js');
const fs = require('fs');

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await CourseModel.find({}).select('-lessons');
    
    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const getLessonsByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(id);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Course details',
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      description,
      courseCategory,
      deliveryMode,
      prerequisites,
      price,
    } = req.body;

    const course = await CourseModel.create({
      courseName,
      description,
      courseCategory,
      deliveryMode,
      prerequisites: JSON.parse(prerequisites), 
      price,
      createdBy: req.user.userId,
      thumbnail: {
        public_id: '',
        secure_url: '',
      },
    });

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'Learning-Management-System',
        });

        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
        await course.save();
        
        fs.rmSync(`uploads/${req.file.filename}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return next(new AppError('Error uploading image', 500));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError('Invalid course ID format', 400));
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new AppError('Course with given id does not exist', 404));
    }

    Object.keys(req.body).forEach(key => {
      course[key] = req.body[key];
    });

    if (req.file) {
      if (course.thumbnail && course.thumbnail.public_id) {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Learning-Management-System',
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      fs.unlinkSync(req.file.path);
    }

    const updatedCourse = await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });

  } catch (error) {
    console.error('Update Course Error:', error);
    return next(new AppError(error.message, 500));
  }
};

const removeCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new AppError('Invalid course ID format', 400));
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new AppError('Course with given id does not exist', 404));
    }

    if (course.thumbnail && course.thumbnail.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    const deletedCourse = await CourseModel.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return next(new AppError('Failed to delete course', 500));
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (e) {
    console.error('Delete Course Error:', e);
    return next(new AppError(e.message, 500));
  }
};

const addLessonToCourseById = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!req.file) return next(new AppError('Video file is required', 400));

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      folder: 'Learning-Management-System/lessons',
    });

    const lesson = {
      title,
      description,
      materials: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    };

    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { 
          $push: { lessons: lesson },
          $inc: { numberOfLessons: 1 }  
      },
      { new: true }
  );

    if (!course) throw new AppError('Course not found', 404);

    if (req.file.path) fs.rmSync(req.file.path, { force: true });

    res.status(200).json({
      success: true,
      message: 'Lesson added successfully',
      course,
    });
  } catch (error) {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
    return next(new AppError(error.message || 'Failed to add lesson', 500));
  }
};


const updateCourseLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, description, lessonNumber, duration, lessonType } = req.body;

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    const lessonIndex = course.lessons.findIndex(
      (lesson) => lesson._id.toString() === lessonId
    );

    if (lessonIndex === -1) {
      return next(new AppError('Lesson not found in the course', 404));
    }

    const updatedLessonData = {
      ...course.lessons[lessonIndex].toObject(),
      ...(title && { title }),
      ...(description && { description }),
      ...(lessonNumber && { lessonNumber }),
      ...(duration && { duration }),
      ...(lessonType && { lessonType }),
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'video',
        folder: 'Learning-Management-System/lessons',
      });

      if (course.lessons[lessonIndex].materials?.public_id) {
        await cloudinary.uploader.destroy(course.lessons[lessonIndex].materials.public_id);
      }

      updatedLessonData.materials = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    course.lessons[lessonIndex] = updatedLessonData;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      course,
    });
  } catch (e) {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
    return next(new AppError(e.message || 'Failed to update lesson', 500));
  }
};


const deleteCourseLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    const lessonIndex = course.lessons.findIndex(
      (lesson) => lesson._id.toString() === lessonId
    );

    if (lessonIndex === -1) {
      return next(new AppError('Lesson not found in the course', 404));
    }

    const lessonMaterial = course.lessons[lessonIndex].materials;
    if (lessonMaterial && lessonMaterial.public_id) {
      await cloudinary.uploader.destroy(lessonMaterial.public_id);
    }

    course.lessons.splice(lessonIndex, 1);
    course.numberOfLessons = course.lessons.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

module.exports = {
  getAllCourses,
  getLessonsByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLessonToCourseById,
  deleteCourseLesson,
  updateCourseLesson,
};
