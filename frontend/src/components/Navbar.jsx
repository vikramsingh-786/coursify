import { useEffect, useState } from "react";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHome,
  FaVideo,
  FaTachometerAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchProfile } from "../redux/slices/auth.slice";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

// Custom hook for theme management
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return { darkMode, toggleDarkMode };
};

// NavLink component for consistent styling
const NavLink = ({ to, icon: Icon, children, isActive, onClick }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 text-lg font-medium transition-all duration-300 hover:scale-105 hover:translate-x-1
      ${
        isActive(to)
          ? "text-blue-500 bg-blue-100/50 dark:bg-blue-900/50 p-2 rounded-lg"
          : "text-gray-800 dark:text-white hover:text-blue-500"
      }`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{children}</span>
  </Link>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logout Successfully");
    navigate("/login");
    setIsMenuOpen(false);
  };

  // Handle menu overflow
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navLinks = [
    {
      to: "/",
      icon: FaHome,
      text: "Home",
      showWhen: "always",
    },
    {
      to: "/admin/dashboard",
      icon: FaTachometerAlt,
      text: "Admin Dashboard",
      showWhen: "admin",
    },
    {
      to: "/admin/courses/create",
      icon: FaVideo,
      text: "Create Courses",
      showWhen: "admin",
    },
    {
      to: "/user/dashboard",
      icon: FaTachometerAlt,
      text: "Dashboard",
      showWhen: "user",
    },
    {
      to: "/courses",
      icon: FaVideo,
      text: "All Courses",
      showWhen: "always",
    },
    {
      to: "/contact",
      icon: FaInfoCircle,
      text: "Contact Us",
      showWhen: "always",
    },
    {
      to: "/about",
      icon: FaInfoCircle,
      text: "About Us",
      showWhen: "always",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center h-[65px] md:h-[72px] px-4 md:px-8 bg-gray-200 dark:bg-gray-900 transition-all duration-300 ease-in-out shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-gray-800 dark:text-white hover:text-blue-500 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto md:h-10 transition-all duration-300"
            />
          </Link>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 transition-colors duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-gray-200"
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          {darkMode ? (
            <FaSun size={24} className="text-yellow-400" />
          ) : (
            <FaMoon size={24} className="text-gray-800 dark:text-white" />
          )}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-[65px] md:top-[72px] left-0 h-[calc(100vh-65px)] md:h-[calc(100vh-72px)] w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg`}
      >
        {/* Navigation Links */}
        <div className="flex flex-col space-y-8 p-10">
          {navLinks.map((link) => {
            const shouldShow =
              link.showWhen === "always" ||
              (link.showWhen === "admin" && user?.role === "admin") ||
              (link.showWhen === "user" && isAuthenticated && user?.role !== "admin");

            return shouldShow ? (
              <NavLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                isActive={isActive}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ) : null;
          })}
        </div>

        {/* Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <div className="space-y-2 mb-10 md:mb-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300"
                >
                  <FaSignOutAlt size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus size={20} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
