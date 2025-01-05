import { useEffect } from "react";
import Layout from "./components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (state) {
      // Course data received, handle if necessary
    }
  }, [state]);

  return (
    <Layout>
      {/* Background changes based on dark/light mode */}
      <section className="min-h-[90vh] md:pt-12 pt-2 px-4 lg:px-20 flex flex-col text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 relative">
          {/* Left section with course details */}
          <div className="lg:col-span-1 space-y-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {state ? (
              <>
                <img
                  className="md:w-[87%] w-full h-auto lg:h-64 rounded-md shadow-md"
                  alt="thumbnail"
                  src={state?.thumbnail?.secure_url}
                />
                <div className="space-y-4">
                  <div className="flex flex-col text-lg font-inter">
                    <p className="font-semibold">
                      <span className="text-yellow-600 dark:text-yellow-500 font-bold">
                        Total lectures:{" "}
                      </span>
                      {state?.numberOfLectures}
                    </p>
                    <p className="font-semibold">
                      <span className="text-yellow-600 dark:text-yellow-500 font-bold">
                        Instructor:{" "}
                      </span>
                      {state?.createdBy}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p>No course found</p> 
            )}
          </div>

          {/* Right section with course description and actions */}
          <div className="lg:col-span-1 space-y-10 text-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {state ? (
              <>
                <h1 className="md:text-3xl text-2xl lg:text-4xl font-bold font-lato text-yellow-500 mb-5 text-center w-fit after:content-[' '] relative after:absolute after:-bottom-3.5 after:left-0 after:h-1.5 after:w-[60%] after:rounded-full after:bg-purple-400 dark:after:bg-purple-600">
                  {state?.title}
                </h1>

                <div className="space-y-1">
                  <h2 className="text-2xl text-gray-800 dark:text-white font-[600] font-inter">
                    Course description:
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-violet-300 font-[500] font-nunito-sans whitespace-pre-wrap">
                    {state?.description}
                  </p>
                </div>

                {/* Conditionally render action buttons based on user role or subscription status */}
                {role === "ADMIN" || user?.subscription?.status === "active" ? (
                  <button
                    onClick={() =>
                      navigate(`courses/${state?._id}/view`, { state: { ...state } })
                    }
                    className="bg-orange-500 dark:bg-orange-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full transition-all ease-in-out duration-300 mb-3 hover:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    Watch Lectures
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="bg-orange-500 dark:bg-orange-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full transition-all ease-in-out duration-300 hover:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    Subscribe
                  </button>
                )}
              </>
            ) : (
              <p>No course details available</p>  
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
