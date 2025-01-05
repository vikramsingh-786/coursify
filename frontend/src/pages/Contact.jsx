import { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { contactUs } from "../redux/slices/contactSlice";
import { LoadingOverlay, FormLoadingOverlay } from "../Spinner";
export default function Contact() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
    inquiryType: "General Inquiry",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.contact
  );

  useEffect(() => {
    if (success) {
      toast.success("Message Sent Successfully");
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        message: "",
        inquiryType: "General Inquiry",
      });
      setIsSubmitting(false);
    }
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
    }
  }, [success, error, message, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(contactUs(formData)).unwrap();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Contact Support
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions about your courses or need support? We're here to
              help you with any issues related to your learning experience.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-blue-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Email Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    bobvik2003@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaPhone className="text-pink-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    +91 9219251196
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-blue-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Office Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    456 Learning Road, Education City, State
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
          {isLoading && <LoadingOverlay message="Loading..." />}
          {isSubmitting && <FormLoadingOverlay message="Sending message..." />}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Course Information">Course Information</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium ${
                    (isSubmitting || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
