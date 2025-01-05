import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCourse } from "../../redux/slices/course.slice";
import { FormLoadingOverlay, LoadingButton } from "../../Spinner";
export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    courseCategory: "Technology",
    price: "",
    deliveryMode: "Online",
    prerequisites: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to create a course.");
      navigate("/login");
    }
  }, [navigate]);

  const [thumbnail, setThumbnail] = useState(null);

  const courseCategories = [
    "Technology",
    "Business",
    "Health & Fitness",
    "Arts & Humanities",
    "Science",
    "Languages",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setThumbnail(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrerequisitesChange = (e) => {
    const prerequisites = e.target.value.split(",").map((req) => req.trim());
    setFormData((prev) => ({
      ...prev,
      prerequisites,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "prerequisites") {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      if (thumbnail) {
        formPayload.append("thumbnail", thumbnail);
      }

      await dispatch(createCourse(formPayload));

      toast.success("Course created successfully!");
      navigate("/courses");

      setFormData({
        courseName: "",
        description: "",
        courseCategory: "Technology",
        price: "",
        deliveryMode: "Online",
        prerequisites: [],
      });
      setThumbnail(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the course."
      );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {loading && <FormLoadingOverlay message="Creating your course..." />}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Create New Course
          </h1>

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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  required
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  placeholder="Enter course price"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Mode
                </label>
                {/* Only one option for delivery mode, no need for select */}
                <input
                  type="text"
                  name="deliveryMode"
                  value="Online"
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                placeholder="Provide a brief description of the course"
                required
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
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                placeholder="Basic programming, Internet connection, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleInputChange}
                className="w-full"
                accept="image/*"
              />
            </div>
            <LoadingButton
              type="submit"
              isLoading={loading}
              loadingText="Creating Course..."
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium hover:from-blue-700 hover:to-pink-700 transition-all duration-300"
            >
              Create Course
            </LoadingButton>
          </form>
        </div>
      </div>
    </Layout>
  );
}
