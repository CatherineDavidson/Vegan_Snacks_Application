import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Eye, EyeOff, Package, Shield, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const navigate = useNavigate();

  // Fetch profile from backend
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Edit, Save, Cancel
  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/user/update", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data);
      setOriginalData(res.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile");
    }
  };

  // Delete account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully!");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account");
    }
  };

  // Profile completion calculation
  const profileFields = ['userName','email','phone','dateOfBirth','address','city','state','pinCode','country'];
const completed = profileFields.filter(f => profileData[f] && profileData[f].trim() !== '').length;
const completionPercentage = Math.round((completed / profileFields.length) * 100);


  return (
    <div className="min-h-screen bg-slate-50">

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {activeTab === 'profile' && (
            <>
              {/* Profile completion bar */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Completion
                </h2>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${completionPercentage}%` }}>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-2">{completionPercentage}% completed</p>
              </div>

              {/* Personal Info Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {[
                  {label:'Full Name', field:'userName', icon:null},
                  {label:'Email Address', field:'email', icon:Mail},
                  {label:'Phone Number', field:'phone', icon:Phone},
                  {label:'Date of Birth', field:'dateOfBirth', icon:Calendar, type:'date'},
                  {label:'Street Address', field:'address', icon:MapPin},
                  {label:'City', field:'city', icon:null},
                  {label:'State/Province', field:'state', icon:null},
                  {label:'PIN/ZIP Code', field:'pinCode', icon:null},
                  {label:'Country', field:'country', icon:null},
                ].map(({label,field,icon:Icon,type='text'}) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 tracking-wide">{label}</label>
                    {isEditing ? (
                      <input
                        type={type}
                        value={profileData[field] || ''}
                        onChange={e => handleInputChange(field, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center min-h-[48px] border border-gray-200">
                        {Icon && <Icon className="w-4 h-4 mr-3 text-gray-500" />}
                        <span className="text-gray-800 font-medium">{profileData[field] || <span className="text-gray-400 italic">Not provided</span>}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
                {!isEditing ? (
                  <button onClick={handleEdit} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleSave} className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                    <button onClick={handleCancel} className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                  </div>
                )}
                
                {!isEditing && (
                  <button onClick={handleDelete} className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Delete Account
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
  );
}