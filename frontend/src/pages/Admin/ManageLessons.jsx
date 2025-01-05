import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  addLessonToCourseById,
  updateCourseLesson,
  deleteCourseLesson,
  getLessonsByCourseId,
} from "../../redux/slices/course.slice";
import Layout from "../../components/Layout";
import {
  LoadingSpinner,
  LoadingButton,
  LoadingOverlay,
  FormLoadingOverlay,
} from "../../Spinner";

export default function CourseLessons({ mode = "view" }) {
  const { id: courseId } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, error } = useSelector((state) => state.courses);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideo, setLessonVideo] = useState(null);
  const [lessonIdToUpdate, setLessonIdToUpdate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingMap, setIsDeletingMap] = useState({});
  const [isUpdatingMap, setIsUpdatingMap] = useState({});

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      await dispatch(getLessonsByCourseId(courseId)).unwrap();
    } catch (err) {
      console.error("Error fetching lessons:", err);
      toast.error("Failed to fetch lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes("video/")) {
        toast.error("Please select a valid video file");
        e.target.value = "";
        return;
      }

      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size exceeds 500MB limit");
        e.target.value = "";
        return;
      }

      setLessonVideo(file);
    }
  };

  const resetForm = () => {
    setLessonTitle("");
    setLessonDescription("");
    setLessonVideo(null);
    setLessonIdToUpdate(null);
  };

  const handleAddLesson = async () => {
    if (!lessonTitle || !lessonDescription || !lessonVideo) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const lessonData = new FormData();
      lessonData.append("title", lessonTitle.trim());
      lessonData.append("description", lessonDescription.trim());
      if (lessonVideo) {
        lessonData.append("materials", lessonVideo, lessonVideo.name);
      }
      await dispatch(addLessonToCourseById({ courseId, lessonData })).unwrap();
      await fetchLessons(); // Refresh the lessons after adding
      toast.success("Lesson added successfully");
      resetForm();
    } catch (err) {
      console.error("Error adding lesson:", err);
      toast.error(err.message || "Failed to add lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!lessonTitle || !lessonDescription || !lessonIdToUpdate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUpdatingMap((prev) => ({ ...prev, [lessonIdToUpdate]: true }));
      
      const lessonData = new FormData();
      lessonData.append("title", lessonTitle.trim());
      lessonData.append("description", lessonDescription.trim());
      if (lessonVideo) {
        lessonData.append("materials", lessonVideo, lessonVideo.name);
      }

      await dispatch(
        updateCourseLesson({
          courseId,
          lessonId: lessonIdToUpdate,
          lessonData,
        })
      ).unwrap();
      
      await fetchLessons(); // Refresh the lessons after updating
      toast.success("Lesson updated successfully");
      resetForm();
    } catch (err) {
      console.error("Error updating lesson:", err);
      toast.error(err.message || "Failed to update lesson");
    } finally {
      setIsSubmitting(false);
      setIsUpdatingMap((prev) => ({ ...prev, [lessonIdToUpdate]: false }));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      setIsDeletingMap((prev) => ({ ...prev, [lessonId]: true }));
      await dispatch(deleteCourseLesson({ courseId, lessonId })).unwrap();
      await fetchLessons(); // Refresh the lessons after deleting
    } catch (err) {
      console.error("Error deleting lesson:", err);
      toast.error(err.message || "Failed to delete lesson");
    } finally {
      setIsDeletingMap((prev) => ({ ...prev, [lessonId]: false }));
    }
  };

  if (error) {
    toast.error("Failed to fetch course details");
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-8">
          {isLoading && <LoadingOverlay message="Loading course lessons..." />}
          {currentCourse && (
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              {mode === "view" ? "Course Lessons" : "Manage Lessons"} -{" "}
              {currentCourse.courseName}
            </h1>
          )}

          {mode === "manage" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              {isSubmitting && (
                <FormLoadingOverlay message="Saving lesson..." />
              )}
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {lessonIdToUpdate ? "Update Lesson" : "Add New Lesson"}
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Lesson Title"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                <textarea
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="Lesson Description"
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lessonIdToUpdate
                      ? "Update Video (optional)"
                      : "Upload Video"}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                              text-sm text-gray-900 dark:text-white
                              file:mr-4 file:py-2 file:px-4 file:rounded-md
                              file:border-0 file:bg-blue-500 file:text-white
                              hover:file:bg-blue-600"
                  />
                  <p className="text-sm text-gray-500">
                    Maximum file size: 500MB. Supported formats: MP4, MOV, AVI,
                    MKV
                  </p>
                </div>
                <div className="flex gap-4">
                  <LoadingButton
                    onClick={
                      lessonIdToUpdate ? handleUpdateLesson : handleAddLesson
                    }
                    isLoading={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {lessonIdToUpdate ? "Update Lesson" : "Add Lesson"}
                  </LoadingButton>

                  {lessonIdToUpdate && (
                    <LoadingButton
                      onClick={resetForm}
                      isLoading={isSubmitting}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Cancel Update
                    </LoadingButton>
                  )}
                </div>
              </div>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {mode === "view" ? "Available Lessons" : "Existing Lessons"}
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner className="h-12 w-12 text-blue-500" />
                <p className="ml-4 text-gray-600 dark:text-gray-300 font-medium">Loading lessons...</p>
              </div>
            ) : currentCourse?.lessons?.length > 0 ? (
              <div
                className={
                  mode === "view"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }
              >
                {currentCourse.lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className={`rounded-lg shadow-lg overflow-hidden relative ${
                      mode === "view" && index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : mode === "view"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    {(isDeletingMap[lesson._id] || isUpdatingMap[lesson._id]) && (
                      <LoadingOverlay 
                        isTransparent={true}
                        message={isDeletingMap[lesson._id] ? "Deleting lesson..." : "Updating lesson..."} 
                      />
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">
                        {mode === "view" && `Lesson ${index + 1}: `}
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {lesson.description}
                      </p>
                      {lesson.materials?.secure_url && (
                        <div className="aspect-video w-full">
                          <video
                            className="w-full h-full rounded-lg"
                            controls
                            controlsList="nodownload"
                            preload="metadata"
                          >
                            <source
                              src={lesson.materials.secure_url}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      {mode === "manage" && (
                        <div className="flex gap-4 mt-4">
                          <LoadingButton
                            onClick={() => {
                              setLessonTitle(lesson.title);
                              setLessonDescription(lesson.description);
                              setLessonIdToUpdate(lesson._id);
                            }}
                            className="px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-500
                                    hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                          >
                            Edit
                          </LoadingButton>
                          <LoadingButton
                            onClick={() => handleDeleteLesson(lesson._id)}
                            isLoading={isDeletingMap[lesson._id]}
                            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white
                                    hover:bg-red-600 disabled:bg-red-300 transition-colors"
                          >
                            Delete
                          </LoadingButton>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-300 p-8">
                No lessons available for this course.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}