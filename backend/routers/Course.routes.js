const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getLessonsByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLessonToCourseById,
  deleteCourseLesson,
  updateCourseLesson,
} = require("../controllers/Course.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");
const roleCheck = require("../middleware/roleCheck.middleware.js");
const upload = require("../middleware/multer.middleware.js");
const { videoUpload } = require("../config/cloudinary.js");
const debugFormData = require("../config/debug.js");

router.get("/", getAllCourses);
router.get("/:id", getLessonsByCourseId);

router.post(
  "/",
  authMiddleware,
  roleCheck(["admin"]),
  debugFormData,
  upload.single("thumbnail"),
  createCourse
);

router.post(
  "/:courseId/lesson",
  authMiddleware,
  roleCheck(["admin"]),
  debugFormData,
  videoUpload.single("materials"),
  addLessonToCourseById
);

router.put(
  "/:courseId/lesson/:lessonId",
  authMiddleware,
  roleCheck(["admin"]),
  videoUpload.single("materials"),
  updateCourseLesson
);

router.delete(
  "/:courseId/lesson/:lessonId",
  authMiddleware,
  roleCheck(["admin"]),
  deleteCourseLesson
);

router.delete(
  "/:courseId", 
  authMiddleware,
  roleCheck(["admin"]),
  removeCourse
);
router.put(
  "/:courseId",
  authMiddleware,
  roleCheck(["admin"]),
  upload.single("thumbnail"),
  updateCourse
);

module.exports = router;
