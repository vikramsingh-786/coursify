import { useState } from "react";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import InputField from "./InputField";
import { login } from "../../redux/slices/auth.slice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="animate-fadeIn w-full max-w-md p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-medium"
              disabled={loading}
            >
              <FaSignInAlt className="h-5 w-5" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Don't have an account?</p>
            <Link to="/signup" className="text-pink-500 hover:text-pink-600 font-medium hover:underline transition-all duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
