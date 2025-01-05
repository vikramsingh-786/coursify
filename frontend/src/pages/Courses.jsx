import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../redux/slices/course.slice";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

export default function AllCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCheckout = location.state?.fromCheckout;

  const { courses, loading, error } = useSelector((state) => state.courses);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (fromCheckout) {
      window.location.reload();
      navigate('/courses', { replace: true, state: {} });
    }
  }, [fromCheckout, navigate]);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {isAdmin ? "Manage Courses" : "Available Courses"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {course.thumbnail?.secure_url && (
                    <img
                      src={course.thumbnail.secure_url}
                      alt={course.courseName}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {course.courseName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {isAdmin ? (
                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            navigate(`/courses/${course._id}/manage`, {
                              state: course,
                            })
                          }
                          className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium"
                        >
                          Manage Lessons
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/course/description", {
                            state: course,
                          })
                        }
                        className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {user ? "View Course" : "Login to View Course"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                No courses available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
