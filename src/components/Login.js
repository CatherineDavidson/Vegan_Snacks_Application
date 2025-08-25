
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import PopUp from "./PopUp";
// import Home1 from "./Home";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { Home } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("role",response.role)
      setSuccess("Login Successful! Redirecting...");

      setTimeout(() => {
        setSuccess("");
              
        // Navigate based on role
        if (response.role === "ADMIN") {
          navigate("/admin");
        } else if (response.role === "VENDOR") {
          navigate("/vendor");
        } else {
          navigate("/user"); // default user dashboard
        }
      }, 1000);
    } catch (err) {
      setError("Invalid Credentials");
      setTimeout(() => setError(""), 4000);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A3DC9A] to-[#5E936C] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-4/5 max-w-md px-8 py-10 border-2 border-[#93DA97]">
        <div className="mb-10 text-center">
          <div className="relative flex justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="absolute left-0 top-[-25px] text-3xl cursor-pointer z-[9999] transition-transform duration-300 hover:scale-125"
              aria-label="home"
            > 🏠 </button>

            <h2 className="text-3xl font-bold text-[#3E5F44]">Welcome Back</h2>
          </div>
          <p className="text-sm text-[#4A9782] mt-1">
            Login to continue ordering your favorite vegan snacks!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-[#3E5F44] text-base font-semibold mb-1">Email</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#5E936C]">
              <span className="px-3 text-[#4A9782]"><FiMail /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                autoComplete="username"    
                className="w-full p-3 bg-transparent text-[#3E5F44] focus:outline-none"
              />
            </div>
          </div>

          {/* Password */} 
          <div>
            <label className="block text-[#3E5F44] text-base font-semibold mb-1">Password</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#5E936C]">
              <span className="px-3 text-[#4A9782]"><FiLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                // type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password" 
                className="w-full p-3 bg-transparent text-[#3E5F44] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="px-3 text-[#4A9782] focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 bg-[#A3DC9A] text-[#3E5F44] font-semibold rounded-lg hover:bg-[#5E936C] hover:text-white transition"
          >
            <FiLogIn />
            Login
          </button>
        </form>

        {/* Popups */}
        <PopUp message={success} type="success" onClose={() => setSuccess("")} />
        <PopUp message={error} type="error" onClose={() => setError("")} />

        {/* Navigate to Register */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/register")}
            className="text-[#4A9782] hover:text-[#3E5F44] font-medium transition"
          >
            Don’t have an account? Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
