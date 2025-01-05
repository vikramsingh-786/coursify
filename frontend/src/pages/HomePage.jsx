
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroPng from "../assets/home.jpg";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { user, token } = useSelector((state) => state.auth);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Add floating animation for background shapes
  const floatingAnimation = {
    animate: {
      y: ["0px", "-20px", "0px"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Layout>
      <section className="md:py-14 py-10 text-gray-900 dark:text-white min-h-[85vh] bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle */}
          <motion.div
            className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating shapes */}
          <motion.div
            className="absolute top-20 left-20 w-20 h-20 bg-purple-200 dark:bg-purple-900/30 rounded-lg blur-xl"
            {...floatingAnimation}
          />
          <motion.div
            className="absolute bottom-32 right-48 w-16 h-16 bg-green-200 dark:bg-green-900/30 rounded-full blur-xl"
            animate={{
              y: ["0px", "30px", "0px"],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200 dark:bg-yellow-900/30 rounded-lg rotate-45 blur-xl"
            animate={{
              rotate: [45, 90, 45],
              transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-shimmer" />
        </div>


        <motion.div
          className="container mx-auto flex md:flex-row flex-col-reverse items-center justify-between md:gap-12 gap-8 md:px-20 px-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.div
            className="md:w-1/2 w-full space-y-8"
            variants={itemVariants}
          >
            <motion.h1
              className="md:text-5xl text-4xl font-bold leading-tight text-gray-900 dark:text-gray-200"
              variants={itemVariants}
            >
              Manage Your{" "}
              <span className="text-blue-600 font-extrabold relative">
                Courses
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 dark:bg-blue-800 -z-10 transform skew-x-12"></span>
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              Simplify your learning journey. Whether you need to enroll in a
              new course, track your progress, or explore new learning
              materials, we've got you covered.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 pt-4"
              variants={itemVariants}
            >
              {user?.role === "admin" ? (
                <Link to="/admin/courses/create">
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add New Course
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </motion.button>
                </Link>
              ) : (
                <Link to="/checkout">
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscription Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.button>
                </Link>
              )}
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
              >
                <motion.button
                  className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium px-8 py-4 rounded-lg text-lg transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user?.role === "admin"
                    ? "Admin Dashboard"
                    : "User Dashboard"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>


          <motion.div className="md:w-1/2 w-full" variants={itemVariants}>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >

              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-75 blur-:opacity-100 transition duration-1000"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute inset-0 bg-blue-200 dark:bg-blue-900 rounded-2xl transform rotate-3"
                animate={{ rotate: [3, -3, 3] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <img
                src={heroPng}
                alt="Learning management system illustration"
                className="relative w-full h-auto max-w-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />

              {/* Decorative dots */}
              <motion.div
                className="absolute -right-8 -bottom-8 w-24 h-24 grid grid-cols-3 gap-2"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
