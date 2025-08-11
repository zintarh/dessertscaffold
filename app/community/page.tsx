'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, GraduationCap, MapPin, Clock, Users, MessageCircle, Heart,
  Award, Zap, TrendingUp, Plus, Bookmark
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  institution: string;
  avatar: string;
  rating: number;
  sessions: number;
  hourlyRate: number;
  expertise: string[];
  bio: string;
  availability: string;
  responseTime: string;
  isOnline: boolean;
  isVerified: boolean;
  location: string;
}

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'AI Research Scientist',
    institution: 'Stanford University',
    avatar: '/images/user1.jpg',
    rating: 4.9,
    sessions: 127,
    responseTime: '< 2 hours',
    location: 'California, USA',
    availability: 'Available',
    hourlyRate: 85,
    expertise: ['Machine Learning', 'Deep Learning', 'Computer Vision'],
    bio: 'Leading AI researcher with 15+ years experience in machine learning and computer vision.',
    isOnline: true,
    isVerified: true
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    title: 'Data Science Professor',
    institution: 'MIT',
    avatar: '/images/user2.jpg',
    rating: 4.8,
    sessions: 89,
    responseTime: '< 4 hours',
    location: 'Massachusetts, USA',
    availability: 'Busy',
    hourlyRate: 95,
    expertise: ['Statistics', 'Data Analysis', 'Python'],
    bio: 'Data science expert with extensive experience in statistical modeling and Python programming.',
    isOnline: false,
    isVerified: true
  },
  {
    id: '3', 
    name: 'Dr. Aisha Patel', 
    title: 'Biomedical Engineering Prof', 
    institution: 'Oxford University',
    avatar: '/images/user2.jpg',
    rating: 5.0, 
    sessions: 312, 
    hourlyRate: 78,
    expertise: ['Biomedical Engineering', 'Data Science', 'Grant Writing'],
    bio: 'Biomedical expert. Secured $2M+ in research funding.',
    availability: 'Available', responseTime: '< 1 hour', isOnline: true, isVerified: true, location: 'Oxford, UK'
  }
];

export default function CommunityPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters] = useState(false);
  const [likedMentors, setLikedMentors] = useState<string[]>([]);
  const [bookmarkedMentors, setBookmarkedMentors] = useState<string[]>([]);

  const filterOptions = {
    expertise: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Quantum Computing', 'Physics', 'Mathematics', 'Biomedical Engineering', 'Data Science'],
    availability: ['Available', 'Busy', 'Offline'],
    institution: ['Stanford University', 'MIT', 'Oxford University', 'Harvard University', 'Cambridge University'],
    priceRange: ['$0-50', '$51-80', '$81-120', '$120+']
  };

  const handleLike = (mentorId: string) => {
    setLikedMentors(prev => prev.includes(mentorId) ? prev.filter(id => id !== mentorId) : [...prev, mentorId]);
  };

  const handleBookmark = (mentorId: string) => {
    setBookmarkedMentors(prev => prev.includes(mentorId) ? prev.filter(id => id !== mentorId) : [...prev, mentorId]);
  };

  const handleMentorClick = (mentorId: string) => {
    router.push(`/community/mentor/${mentorId}`);
  };

  const filteredMentors = mentors.filter((mentor: Mentor) => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mentor.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = selectedFilters.length === 0 || 
                          selectedFilters.some(filter => 
                            mentor.expertise.includes(filter) || mentor.availability === filter || mentor.institution === filter);
    return matchesSearch && matchesFilters;
  });

  return (
    <div className={`min-h-screen transition-all duration-500 font-['Urbanist'] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    } relative overflow-hidden`}>
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-600/5'}`} style={{ left: '10%', top: '10%' }} />
        <div className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${isDarkMode ? 'bg-emerald-500/8' : 'bg-emerald-500/4'}`} />
        <div className={`absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full blur-xl animate-pulse ${isDarkMode ? 'bg-amber-500/8' : 'bg-amber-500/4'}`} />
      </div>

      {/* Top Search Bar */}
      <motion.div className="relative z-50 px-6 py-4 backdrop-blur-sm border-b border-gray-200/20" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Dissertation Scaffold
            </span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search mentors, expertise, institutions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  isDarkMode ? 'bg-gray-800/90 border-gray-700 text-white placeholder-gray-400' : 'bg-white/90 border-gray-200 text-gray-900 placeholder-gray-500'}`} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/community" className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'
            }`}>
              Community
            </Link>
            <Link href="/pricing" className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'
            }`}>
              Pricing
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-4 max-w-7xl mx-auto">
              <div className={`rounded-2xl p-4 border backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="space-y-2">
                      <h3 className={`font-semibold text-sm capitalize ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="space-y-1">
                        {options.map((option) => (
                          <motion.button key={option} onClick={() => {
                            setSelectedFilters(prev => prev.includes(option) ? prev.filter(f => f !== option) : [...prev, option]);
                          }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedFilters.includes(option) ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' : 
                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Title */}
       
        <motion.div className="mb-6 gap-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Discover Mentors</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filteredMentors.length} researchers ready to guide your journey</p>
        </motion.div>
        
        <div className="flex gap-8 items-start">
          
        {/* Sidebar */}
        <motion.div className="w-80 space-y-6 hidden lg:block" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
            <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community Stats</h3>
            <div className="space-y-4">
              <motion.div className="flex items-center justify-between" whileHover={{ x: 5 }}>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Active Mentors</span>
                </div>
                <span className="font-bold text-gray-600">2,847</span>
              </motion.div>
              <motion.div className="flex items-center justify-between" whileHover={{ x: 5 }}>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Sessions Today</span>
                </div>
                <span className="font-bold text-gray-600">156</span>
              </motion.div>
              <motion.div className="flex items-center justify-between" whileHover={{ x: 5 }}>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Success Rate</span>
                </div>
                <span className="font-bold text-gray-600">98.4%</span>
              </motion.div>
            </div>
          </div>

          <div className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
            <h3 className={`font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <TrendingUp className="w-5 h-5 text-slate-500" />
              <span>Trending</span>
            </h3>
            <div className="space-y-3">
              {[
                { topic: "AI Research", trend: "+15%", color: "text-gray-600" },
                { topic: "Grant Writing", trend: "+8%", color: "text-gray-600" },
                { topic: "PhD Tips", trend: "+22%", color: "text-gray-600" },
                { topic: "Methodology", trend: "+5%", color: "text-gray-600" }
              ].map((item, i) => (
                <motion.div key={i} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  whileHover={{ x: 5 }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.topic}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Feed */}
        <div className="flex-1">

          <motion.div className="space-y-4" layout>
            <AnimatePresence>
              {filteredMentors.map((mentor, index) => (
                <motion.div key={mentor.id} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => handleMentorClick(mentor.id)}
                  className={`rounded-3xl p-6 border-0 shadow-2xl backdrop-blur-xl hover:shadow-3xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 hover:from-gray-700/95 hover:to-gray-800/95' 
                      : 'bg-gradient-to-br from-white/95 to-gray-50/95 hover:from-white hover:to-gray-50'
                  } hover:rotate-[0.5deg]`}
                  whileHover={{ y: -2, scale: 1.01 }}>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative">
                        <motion.div className="w-14 h-14 bg-gradient-to-br relative  flex items-center justify-center text-white font-bold text-lg shadow-lg" whileHover={{ rotate: 5 }}>
                         <Image src={mentor.avatar} alt={mentor.name} className='rounded-xl' fill />
                        </motion.div>
                        {mentor.isOnline && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />}
                        {mentor.isVerified && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><Award className="w-2.5 h-2.5 text-white" /></div>}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`font-black text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mentor.name}</h3>
                           <motion.div className="flex items-center space-x-1 bg-gradient-to-r from-gray-400 to-gray-500 px-2 py-1 rounded-full" whileHover={{ scale: 1.05 }}>
                            <GraduationCap className="w-3 h-3 text-white fill-current" />
                            <span className="font-bold text-xs text-white">{mentor.rating}</span>
                          </motion.div>
                        </div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mentor.title}</p>
                         <p className="text-gray-600 text-sm font-semibold">{mentor.institution}</p>
                        <div className="flex items-center space-x-3 mt-3">
                           <motion.div className={`px-3 py-1 rounded-full text-xs font-bold ${
                             mentor.availability === 'Available'
                               ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                               : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                           }`} whileHover={{ scale: 1.05 }}>
                            {mentor.availability}
                          </motion.div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {mentor.responseTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {mentor.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                         <div className="font-bold text-xl text-gray-700">${mentor.hourlyRate}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>per hour</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button onClick={(e) => { e.stopPropagation(); handleLike(mentor.id); }}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            likedMentors.includes(mentor.id) ? 'bg-red-500 text-white' : 
                            isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'}`}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Heart className="w-4 h-4" />
                        </motion.button>
                        <motion.button onClick={(e) => { e.stopPropagation(); handleBookmark(mentor.id); }}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            bookmarkedMentors.includes(mentor.id) ? 'bg-amber-500 text-white' : 
                            isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-amber-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white'}`}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Bookmark className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                       <span key={skill} className={`px-3 py-1 rounded-full text-xs font-medium ${
                         isDarkMode ? 'bg-gray-500/15 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                        +{mentor.expertise.length - 3}
                      </span>
                    )}
                  </div>

                  <motion.div className="mt-4  transition-all duration-300">
                     <motion.button onClick={() => handleMentorClick(mentor.id) }                     className="w-full bg-gradient-to-r from-blue-600/90 to-emerald-500/90 text-white font-semibold py-2 rounded-xl hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Zap className="w-4 h-4" />
                      <span>Quick Connect</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div className="fixed bottom-8 right-8 z-50" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}>
        <motion.button className="w-16 h-16 bg-gradient-to-r from-blue-600/90 to-emerald-500/90 rounded-full shadow-2xl flex items-center justify-center text-white"
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          animate={{ boxShadow: ["0 0 20px rgba(59, 130, 246, 0.4)", "0 0 30px rgba(16, 185, 129, 0.4)", "0 0 20px rgba(59, 130, 246, 0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <Plus className="w-8 h-8" />
        </motion.button>
      </motion.div>
    </div>
  );
}
