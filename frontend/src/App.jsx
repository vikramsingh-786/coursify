import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import Profile from "./profile/Profile";
import CreateCourse from "./pages/Admin/CreateCourse";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EditCourse from "./pages/Admin/EditCourse";
import CourseLessons from "./pages/Admin/ManageLessons";
import Checkout from "./pages/payment/Checkout";
import CheckoutSuccess from "./pages/payment/CheckoutSuccess";
import CheckoutFail from "./pages/payment/CheckoutFail";
import CourseDescription from "./CourseDescription";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./redux/slices/auth.slice";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserValidity = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user) {
        const result = await dispatch(fetchProfile());

        if (fetchProfile.rejected.match(result)) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          console.error('User is invalid or deleted. User and token cleared from localStorage.');
        }
      }
    };

    checkUserValidity();
  }, [dispatch]);
  
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/course/description" element={<CourseDescription />} />
          <Route path="/admin/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/manage" element={<CourseLessons mode="manage" />} />
          <Route path="/course/description/courses/:id/view" element={<CourseLessons mode="view" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/courses/edit/:courseId" element={<EditCourse />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/checkout/success" element={<CheckoutSuccess/>} />
          <Route path="/checkout/failed" element={<CheckoutFail/>} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;