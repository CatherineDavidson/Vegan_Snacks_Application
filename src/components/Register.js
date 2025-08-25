import React, { useState, useEffect, useRef } from "react";
import { handleAxiosError } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const roles = [
  { label: "Customer", value: "CUSTOMER", icon: "👤" },
  { label: "Vendor", value: "VENDOR", icon: "🛍️" },
  { label: "Product Manager", value: "PRODUCT_MANAGER", icon: "📦" },
];

const Register = () => {
  const navigate = useNavigate();
  const[currentStep,setCurrentStep]=useState(1);

  //Basic Registration form
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: ''
  });

  //Vendor Specific form
  const[vendorData,setVendorData] = useState({
    companyName: '',
    businessEmail: '',
    primaryContactNumber: '',
    businessDescription: '',
    businessRegistrationNumber: '',
    businessLicenseNumber: '',
    taxId: '',
    establishedYear: '',
    websiteUrl: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: ''
  })
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const dropdownRef = useRef();


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleVendorChange = (e) => {
    setVendorData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.userName || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }

    if(formData.role === 'VENDOR'){
      setCurrentStep(2);
      return;   
    }

    await submitRegistration();
  }

  const handleVendorSubmit = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(vendorData).some(value => value.trim() === "");
    if (isEmptyField) {
      setError("All fields are required!");
      setTimeout(() => setError(""), 1000); // auto hide after 3s
      return;
    }

    setError("");
    setSuccess("");

    await submitRegistration();
  } 

  const submitRegistration = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const registrationData = {
        user: formData,
        vendor: formData.role === "VENDOR" ? vendorData : null
      };

      const response = await axios.post("/api/auth/register", registrationData);

      setSuccess(`${response.data} Redirecting to login...`);

      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 3000);

    } catch (error) {
      handleAxiosError(error, "Registration failed due to unknown error");

      setError(error.message || "Registration failed");
      setTimeout(() => setError(""), 4000);

    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role: role.value }));
    setIsDropdownOpen(false);
  };

  const renderBasicForm = () => {
    return(
      <div >
        <form onSubmit={handleBasicSubmit} className="space-y-4">
          <div>
            <label className="block text-[#3E5F44] text-base font-semibold mb-1">Username</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#93DA97]">
              <span className="px-3 text-[#4A9782]"><FiUser /></span>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className="w-full p-3 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3E5F44] text-base font-semibold mb-1">Email</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#93DA97]">
              <span className="px-3 text-[#4A9782]"><FiMail /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-3 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3E5F44] text-base font-semibold mb-1">Password</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#93DA97]">
              <span className="px-3 text-[#4A9782]"><FiLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full p-3 bg-transparent focus:outline-none"
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

          {/* Role Dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-base font-semibold text-[#3E5F44] mb-1">Role</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="w-full flex justify-between items-center px-4 py-2 bg-[#E8FFD7] border border-[#A3DC9A] rounded-lg shadow-sm hover:shadow-md transition focus:outline-none"
            >
              <span className="text-[#3E5F44] font-medium">
                {formData.role
                  ? roles.find(r => r.value === formData.role).label
                  : "-- Select a Role --"}
              </span>
              <span className="text-[#4A9782]">&#9662;</span>
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-[#E8FFD7] border border-[#A3DC9A] rounded-lg shadow-md max-h-48 overflow-y-auto">
                {roles.map((role) => (
                  <li
                    key={role.value}
                    onClick={() => handleRoleSelect(role)}
                    className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-[#D0F1C4] hover:shadow-md transition border-b border-[#D0F1C4] last:border-b-0"
                  >
                    <span className="text-[#3E5F44]">{role.icon} {role.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            onClick={handleBasicSubmit}
            className="w-full py-3 bg-[#4A9782] text-white font-semibold rounded-lg hover:bg-[#3E5F44] transition"
          >
            {formData.role === 'VENDOR' ? 'Continue to Vendor Details' : 'Register'}
          </button>
        </form>
      </div>
    )
  }

  const renderVendorForm = () => (
      <div className="space-y-6">
        {/* Business Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#3E5F44] mb-3 flex items-center">
            🏢 Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={vendorData.companyName}
                onChange={handleVendorChange}
                required
                placeholder="Your company name"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Business Email *</label>
              <input
                type="email"
                name="businessEmail"
                value={vendorData.businessEmail}
                onChange={handleVendorChange}
                required
                placeholder="business@company.com"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Primary Contact *</label>
              <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#93DA97]">
                <span className="px-3 text-[#4A9782]">📞</span>
                <input
                  type="tel"
                  name="primaryContactNumber"
                  value={vendorData.primaryContactNumber}
                  onChange={handleVendorChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-2 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Established Year</label>
              <input
                type="number"
                name="establishedYear"
                value={vendorData.establishedYear}
                onChange={handleVendorChange}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#3E5F44] text-sm font-medium mb-1">Business Description</label>
            <textarea
              name="businessDescription"
              value={vendorData.businessDescription}
              onChange={handleVendorChange}
              placeholder="Describe your business and products..."
              rows="3"
              className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-[#3E5F44] text-sm font-medium mb-1">Website URL</label>
            <div className="flex items-center border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus-within:ring-2 focus-within:ring-[#93DA97]">
              <span className="px-3 text-[#4A9782]">🌐</span>
              <input
                type="url"
                name="websiteUrl"
                value={vendorData.websiteUrl}
                onChange={handleVendorChange}
                placeholder="https://yourcompany.com"
                className="w-full p-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Legal & Tax Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#3E5F44] mb-3">📋 Legal & Tax Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Business Registration Number</label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={vendorData.businessRegistrationNumber}
                onChange={handleVendorChange}
                placeholder="REG123456789"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Business License Number</label>
              <input
                type="text"
                name="businessLicenseNumber"
                value={vendorData.businessLicenseNumber}
                onChange={handleVendorChange}
                placeholder="LIC123456789"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Tax ID / EIN</label>
              <input
                type="text"
                name="taxId"
                value={vendorData.taxId}
                onChange={handleVendorChange}
                placeholder="12-3456789"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#3E5F44] mb-3 flex items-center">
            📍 Business Address
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Street Address 1 *</label>
              <input
                type="text"
                name="streetAddress1"
                value={vendorData.streetAddress1}
                onChange={handleVendorChange}
                required
                placeholder="123 Main Street"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#3E5F44] text-sm font-medium mb-1">Street Address 2</label>
              <input
                type="text"
                name="streetAddress2"
                value={vendorData.streetAddress2}
                onChange={handleVendorChange}
                placeholder="Suite 100 (optional)"
                className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#3E5F44] text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={vendorData.city}
                  onChange={handleVendorChange}
                  required
                  placeholder="New York"
                  className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#3E5F44] text-sm font-medium mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={vendorData.state}
                  onChange={handleVendorChange}
                  required
                  placeholder="NY"
                  className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#3E5F44] text-sm font-medium mb-1">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={vendorData.postalCode}
                  onChange={handleVendorChange}
                  required
                  placeholder="10001"
                  className="w-full p-2 border border-[#A3DC9A] rounded-lg bg-[#E8FFD7] focus:ring-2 focus:ring-[#93DA97] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleVendorSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-[#4A9782] text-white font-semibold rounded-lg hover:bg-[#3E5F44] transition disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A3DC9A] to-[#5E936C] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-4/5 max-w-md px-6 py-4">
        <div className="mb-4 text-center">
           <div className="relative flex justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="absolute left-[-7px] top-[-5px] text-3xl cursor-pointer z-[9999] transition-transform duration-300 hover:scale-125"
              aria-label="home"
            > 🏠 </button>
            <h2 className="text-3xl font-bold text-[#3E5F44]">
              {currentStep === 1 ? 'Create Your Account' : 'Vendor Business Details'}
            </h2>
          </div>
          <p className="text-sm text-[#4A9782] mt-1">
            {currentStep === 1 
              ? 'Join the fun and order your favorite vegan snacks!' 
              : 'Tell us about your business to complete vendor registration'}
          </p>
                    
          {/* Progress indicator for vendor registration */}
          {formData.role === 'VENDOR' && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-[#4A9782] text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-[#4A9782]' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-[#4A9782] text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
          )}
        </div>

        {currentStep === 1 ? renderBasicForm() : renderVendorForm()}

        <PopUp message={success} type="success" onClose={() => setSuccess("")} />
        <PopUp message={error} type="error" onClose={() => setError("")} />

        {currentStep === 1 && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-[#3E5F44] hover:text-[#1E4030] font-medium transition"
            >
              Already have an account? Login here
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
