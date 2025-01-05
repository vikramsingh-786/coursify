import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLessonsByCourseId, updateCourse } from "../../redux/slices/course.slice";
import { LoadingOverlay, FormLoadingOverlay } from "../../Spinner";

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, loading, error } = useSelector((state) => state.courses);
  const [thumbnail, setThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    courseCategory: "Technology",
    price: "",
    deliveryMode: "Online",
    prerequisites: [],
    thumbnailUrl: ""
  });

  const courseCategories = [
    "Technology", "Business", "Health & Fitness",
    "Arts & Humanities", "Science", "Languages"
  ];

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getLessonsByCourseId(courseId)).unwrap();
      } catch (err) {
        console.error("Error fetching course:", err);
        toast.error("Failed to fetch course details");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (currentCourse) {
      const parsedPrerequisites = Array.isArray(currentCourse.prerequisites) 
        ? currentCourse.prerequisites.map(prereq => {
            try {
              return JSON.parse(prereq);
            } catch {
              return prereq;
            }
          }).flat()
        : [];

      setFormData({
        courseName: currentCourse.courseName || "",
        description: currentCourse.description || "",
        courseCategory: currentCourse.courseCategory || "Technology",
        price: currentCourse.price || "",
        deliveryMode: currentCourse.deliveryMode || "Online",
        prerequisites: parsedPrerequisites,
        thumbnailUrl: currentCourse.thumbnail?.secure_url || ""
      });
    }
  }, [currentCourse]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setThumbnail(file);
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          thumbnailUrl: previewUrl
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePrerequisitesChange = (e) => {
    const prerequisites = e.target.value.split(",")
      .map(req => req.trim())
      .filter(req => req !== "");
    setFormData(prev => ({
      ...prev,
      prerequisites
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const formPayload = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'prerequisites') {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'thumbnailUrl') {
          formPayload.append(key, formData[key]);
        }
      });

      if (thumbnail) {
        formPayload.append("thumbnail", thumbnail);
      }

      await dispatch(updateCourse({ courseId, courseData: formPayload })).unwrap();
      toast.success("Course updated successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
          {isLoading && <LoadingOverlay message="Loading course details..." />}
          {isSubmitting && <FormLoadingOverlay message="Updating course..." />}
          
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Edit Course
          </h1>

          {error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter course name"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course Category
                  </label>
                  <select
                    name="courseCategory"
                    value={formData.courseCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={isSubmitting}
                  >
                    {courseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter course price"
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Mode
                  </label>
                  <input
                    type="text"
                    name="deliveryMode"
                    value={formData.deliveryMode}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter course description"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prerequisites (comma-separated)
                </label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites.join(", ")}
                  onChange={handlePrerequisitesChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter prerequisites separated by commas"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Thumbnail
                </label>
                {formData.thumbnailUrl && (
                  <div className="mb-2">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Course thumbnail"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleInputChange}
                  className="w-full"
                  accept="image/*"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium 
                         hover:from-blue-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Updating Course...</span>
                  </div>
                ) : (
                  "Update Course"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}