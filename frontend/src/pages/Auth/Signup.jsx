import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import InputField from "./InputField";
import { register } from "../../redux/slices/auth.slice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        return toast.error('File size must be less than 5MB');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, avatar: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, avatar } = formData;
  
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }
  
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", name);
    formDataToSubmit.append("email", email);
    formDataToSubmit.append("password", password);
    formDataToSubmit.append("confirmPassword", confirmPassword);
    if (avatar) {
      formDataToSubmit.append("avatar", avatar);
    }
  
    try {
      const result = await dispatch(register(formDataToSubmit));
      if (register.fulfilled.match(result)) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);  // Log full error for debugging
      const errorMessage = err?.message || err?.response?.data || "Registration failed due to server timeout";
      toast.error(errorMessage);
    }
  };
  
  

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="animate-fadeIn w-full max-w-md p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-16 w-16">
                <img
                  src={previewImage || "/default-avatar.png"}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <FaCamera className="text-gray-600 w-4 h-4" />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 cursor-pointer
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-gray-700 dark:file:text-gray-200"
                />
              </div>
            </div>

            <InputField
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              Icon={FaUser}
              error={error?.name}
            />
            <InputField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              Icon={FaEnvelope}
              error={error?.email}
            />
            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              Icon={FaLock}
              error={error?.password}
            />
            <InputField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              Icon={FaLock}
              error={error?.confirmPassword}
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-medium"
              disabled={loading}
            >
              <FaUserPlus className="h-5 w-5" />
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Already have an account?</p>
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-all duration-300">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}