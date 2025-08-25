import React, { useEffect, useState } from 'react';
import ad from '../images/snackGirl.png';
import cookies from '../images/cookies.png';
import { X, Menu, Zap, Star, Users, Shield, Sparkles, MessageCircle, ChevronRight, ArrowRight, Play, Sun, Moon, Apple, Cherry, Carrot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  
  const [categories, setCategories] = useState([
    { id: 1, name: "Power Crunch", description: "Energy-packed crispy snacks for active lifestyles", color: "from-green-500 to-lime-500" },
    { id: 2, name: "Sweet Escape", description: "Guilt-free desserts that satisfy your sweet tooth", color: "from-yellow-500 to-orange-500" },
    { id: 3, name: "Protein Boost", description: "High-protein snacks for muscle building and recovery", color: "from-emerald-500 to-green-500" }
  ]);
  
  const [testimonials, setTestimonials] = useState([
    { name: "Alex Thompson", role: { roleName: "Nutritionist" }, content: "The quality and taste exceeded all my expectations. Perfect for my clients!", rating: 5, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Maya Patel", role: { roleName: "Yoga Instructor" }, content: "These snacks give me sustained energy throughout my classes. Absolutely love them!", rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" }
  ]);
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    // Simulated API call
    setTimeout(() => {
      setSuccessMessage('Message sent successfully!');
      setContactForm({ name: '', email: '', message: '' });
    }, 1000);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Theme-based classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-900' : 'bg-green-50',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    cardBg: isDarkMode ? 'bg-slate-800' : 'bg-white',
    cardBorder: isDarkMode ? 'border-slate-700' : 'border-green-200',
    navBg: isDarkMode ? 'bg-slate-900/90' : 'bg-white/90',
    sectionBg: isDarkMode ? 'bg-slate-800/50' : 'bg-green-100/50',
    inputBg: isDarkMode ? 'bg-slate-700' : 'bg-white',
    inputBorder: isDarkMode ? 'border-slate-600' : 'border-green-300',
    textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
    textTertiary: isDarkMode ? 'text-slate-400' : 'text-slate-500'
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-500`}>
     

      {/* Floating Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? `${themeClasses.navBg} backdrop-blur-xl shadow-2xl ${themeClasses.cardBorder} border-b` 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => scrollToSection('hero')}
            >
              Fresh<span className="text-yellow-400">Bites</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className={`${themeClasses.textSecondary} hover:text-green-500 font-medium transition-colors`}>
                Features
              </button>
              <button onClick={() => scrollToSection('categories')} className={`${themeClasses.textSecondary} hover:text-green-500 font-medium transition-colors`}>
                Categories
              </button>
              <button onClick={() => scrollToSection('testimonials')} className={`${themeClasses.textSecondary} hover:text-green-500 font-medium transition-colors`}>
                Reviews
              </button>
              <button onClick={() => scrollToSection('contact')} className={`${themeClasses.textSecondary} hover:text-green-500 font-medium transition-colors`}>
                Contact
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${themeClasses.textSecondary} hover:text-green-500 transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => {navigate('/login')}}
                className="px-4 py-2 text-green-500 border border-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                Login
              </button>
              <button 
                onClick={()=> {navigate('/register')}}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full hover:from-green-600 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                Register
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 ${themeClasses.textSecondary} hover:text-green-500 transition-colors`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden ${themeClasses.navBg} backdrop-blur-xl ${themeClasses.cardBorder} border-t`}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection('features')} className={`block w-full text-left px-3 py-2 ${themeClasses.textSecondary} hover:text-green-500`}>Features</button>
              <button onClick={() => scrollToSection('categories')} className={`block w-full text-left px-3 py-2 ${themeClasses.textSecondary} hover:text-green-500`}>Categories</button>
              <button onClick={() => scrollToSection('testimonials')} className={`block w-full text-left px-3 py-2 ${themeClasses.textSecondary} hover:text-green-500`}>Reviews</button>
              <button onClick={() => scrollToSection('contact')} className={`block w-full text-left px-3 py-2 ${themeClasses.textSecondary} hover:text-green-500`}>Contact</button>
              <div className="flex items-center justify-between pt-2">
                <button onClick={toggleTheme} className={`p-2 ${themeClasses.textSecondary} hover:text-green-500`}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <div className="pt-4 space-y-2">
                <button onClick={navigate('/login')} className="block w-full px-3 py-2 text-green-500 border border-green-500 rounded-lg">Login</button>
                <button onClick={navigate('/register')} className="block w-full px-3 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg">Register</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-500/20 to-lime-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-lime-500/20 border border-green-500/30 text-green-400 rounded-full text-sm font-medium mb-8 backdrop-blur-sm`}>
            <Sparkles className="w-4 h-4 mr-2" />
            100% Plant-Based • Organic • Sustainable
          </div>
          
          <div className="relative flex justify-center items-center">
              <img 
    src={ad}
    alt="Side Image" 
    className="absolute left-[25%] transform -translate-x-full max-w-[350px]"
  />
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
              Hi !
            </span>
            <br />
            <span className={themeClasses.text}>Herbivore</span>
          </h1>
          <img 
    src={cookies} 
    alt="Cookie" 
    className="absolute left-[72%]  transform -translate-x-full  top-[-52px]  max-w-[450px] animate-float"
  />
          </div>
          <br>
          </br>
          
          <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-12 max-w-4xl mx-auto leading-relaxed`}>
            Experience the future of plant-based nutrition with our scientifically crafted, 
            organic <b className="bg-gradient-to-r from-green-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent"><i>snacks</i></b>  that fuel your ambitions and nurture the planet.
          </p>



          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <button 
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-lime-500 text-white text-lg font-semibold rounded-full hover:from-green-600 hover:to-lime-600 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/25 flex items-center"
            onClick={() => navigate('/register')}
            >
              Onboard as vendor
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="group flex items-center px-8 py-4 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Login
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-6 ${themeClasses.cardBorder} border`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent mb-2">100K+</div>
              <div className={themeClasses.textTertiary}>Happy Vegans</div>
            </div>
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-6 ${themeClasses.cardBorder} border`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className={themeClasses.textTertiary}>Plant-Based Products</div>
            </div>
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-6 ${themeClasses.cardBorder} border`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">4.9★</div>
              <div className={themeClasses.textTertiary}>Average Rating</div>
            </div>
            <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-2xl p-6 ${themeClasses.cardBorder} border`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent mb-2">50+</div>
              <div className={themeClasses.textTertiary}>Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-24 px-4 ${themeClasses.sectionBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Why <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">FreshBites</span>?
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              We've revolutionized plant-based snacking with cutting-edge nutrition science and sustainable practices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className={`group relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-lime-500/20 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-lime-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Plant-Powered Nutrition</h3>
                <p className={`${themeClasses.textSecondary} leading-relaxed`}>Packed with superfoods, plant proteins, and essential nutrients for peak performance.</p>
              </div>
            </div>

            <div className={`group relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/25">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Organic Quality</h3>
                <p className={`${themeClasses.textSecondary} leading-relaxed`}>Certified organic ingredients sourced from sustainable farms worldwide.</p>
              </div>
            </div>

            <div className={`group relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/25">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Vegan Community</h3>
                <p className={`${themeClasses.textSecondary} leading-relaxed`}>Join thousands of plant-based enthusiasts transforming their lifestyle with us.</p>
              </div>
            </div>

            <div className={`group relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-lime-500/50 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-lime-500/25">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Nutritionist Support</h3>
                <p className={`${themeClasses.textSecondary} leading-relaxed`}>24/7 plant-based nutritionist support and personalized meal plans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">Perfect</span> Match
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              Every plant-based snack is crafted for specific goals and lifestyles. Find yours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.id} className={`group relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-green-400 transition-all duration-500 transform hover:-translate-y-4 overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${cat.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>{cat.name}</h3>
                  <p className={`${themeClasses.textSecondary} mb-8 leading-relaxed text-lg`}>{cat.description}</p>
                  <button className={`group/btn flex items-center text-transparent bg-gradient-to-r ${cat.color} bg-clip-text font-semibold text-lg hover:scale-105 transition-transform`}>
                    Explore Collection
                    <ChevronRight className={`ml-1 w-5 h-5 ${themeClasses.text} group-hover/btn:translate-x-1 transition-transform`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-24 px-4 ${themeClasses.sectionBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Loved by <span className="bg-gradient-to-r from-lime-400 to-yellow-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              Real transformations from real people who chose to elevate their plant-based lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`relative ${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.cardBorder} border hover:border-green-400 transition-all duration-300 transform hover:-translate-y-2`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-yellow-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 ring-4 ring-green-500/20"
                    />
                    <div>
                      <h4 className={`text-xl font-bold ${themeClasses.text}`}>{testimonial.name}</h4>
                      <p className="text-green-500 font-medium">{testimonial.role?.roleName}</p>
                    </div>
                  </div>
                  
                  <p className={`${themeClasses.textSecondary} text-lg mb-6 leading-relaxed`}>
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className={`ml-2 ${themeClasses.textTertiary} font-semibold`}>{testimonial.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Let's <span className="bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto leading-relaxed`}>
              Ready to transform your plant-based lifestyle? We're here to help you every step of the way.
            </p>
          </div>

          <div className={`${themeClasses.cardBg} rounded-3xl p-8 md:p-12 ${themeClasses.cardBorder} border shadow-2xl`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${themeClasses.textSecondary} font-medium mb-3`}>Your Name</label>
                  <input
                    name="name"
                    value={contactForm.name}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-4 ${themeClasses.inputBg} ${themeClasses.inputBorder} border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${themeClasses.text} placeholder-slate-400`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${themeClasses.textSecondary} font-medium mb-3`}>Your Message</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-4 ${themeClasses.inputBg} ${themeClasses.inputBorder} border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none ${themeClasses.text} placeholder-slate-400`}
                  placeholder="Tell us about your plant-based goals and preferences..."
                />
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-4 bg-gradient-to-r from-green-500 to-lime-500 text-white text-lg font-semibold rounded-full hover:from-green-600 hover:to-lime-600 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/25"
                >
                  Send Message
                </button>
              </div>
              
              {successMessage && (
                <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-lime-500/20 border border-green-500/30 text-green-400 rounded-xl">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="text-center p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 rounded-xl">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${themeClasses.sectionBg} ${themeClasses.cardBorder} border-t py-16 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent mb-6">
            Fresh<span className="text-yellow-400">Bites</span>
          </div>
          <p className={`${themeClasses.textTertiary} mb-8 text-lg max-w-2xl mx-auto`}>
            Revolutionizing plant-based nutrition, one premium vegan snack at a time. Join the green revolution.
          </p>
          <div className={`${themeClasses.cardBorder} border-t pt-8`}>
            <p className={themeClasses.textTertiary}>
              © 2024 FreshBites. All rights reserved. Crafted with 🌱 for a sustainable future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;