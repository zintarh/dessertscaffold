'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {  useParams } from 'next/navigation';
import ThemeToggle from '../../../components/ThemeToggle';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  ArrowLeft, Star, MapPin, Clock, Users, MessageCircle, Heart,
  Award, Share2, Bookmark, Calendar, Globe, CheckCircle, Video, Phone, BookOpen
} from 'lucide-react';

export default function MentorDetailsPage() {
  const params = useParams();
  const { isDarkMode } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock mentor data - in real app, fetch by ID
  const mentor = {
    id: params.id,
    name: 'Dr. Sarah Chen',
    title: 'Professor of AI & Machine Learning',
    institution: 'Stanford University',
    avatar: 'SC',
    rating: 4.9,
    sessions: 247,
    hourlyRate: 85,
    expertise: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Research Methods', 'Academic Writing'],
    bio: 'Leading AI researcher with 15+ years experience. Published 80+ papers in top-tier conferences including NIPS, ICML, and ICLR. Passionate about mentoring the next generation of researchers.',
    availability: 'Available',
    responseTime: '< 2 hours',
    isOnline: true,
    isVerified: true,
    location: 'California, USA',
    languages: ['English', 'Mandarin'],
    education: ['PhD Computer Science - MIT', 'MS Computer Science - Stanford'],
    achievements: ['80+ Published Papers', '$2.5M Research Funding', 'Best Paper Award 2023'],
    reviews: [
      { name: 'Alex Johnson', rating: 5, comment: 'Incredible mentor! Dr. Chen helped me refine my research methodology.', date: '2 weeks ago' },
      { name: 'Maria Garcia', rating: 5, comment: 'Her expertise in ML is unmatched. Highly recommend!', date: '1 month ago' },
      { name: 'David Kim', rating: 5, comment: 'Patient, knowledgeable, and truly cares about student success.', date: '2 months ago' }
    ]
  };

  return (
    <div className={`min-h-screen transition-all duration-500 font-['Urbanist'] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    } relative overflow-hidden`}>
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-600/10'}`} style={{ left: '10%', top: '10%' }} />
        <div className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl animate-bounce ${isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-500/8'}`} />
      </div>

      {/* Navigation */}
      <motion.nav className="relative z-50 px-6 py-6 backdrop-blur-sm" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/community" className="flex items-center space-x-3 group">
            <motion.div className="p-2 rounded-xl bg-gray-800/50 group-hover:bg-gray-700" whileHover={{ scale: 1.05 }}>
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">Back to Community</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <motion.div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                      whileHover={{ rotate: 5 }}>
                      {mentor.avatar}
                    </motion.div>
                    {mentor.isOnline && <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse" />}
                    {mentor.isVerified && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>}
                  </div>
                  
                  <div>
                    <h1 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mentor.name}</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mentor.title}</p>
                    <p className="text-blue-500 font-semibold">{mentor.institution}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-xl">{mentor.rating}</span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({mentor.sessions} sessions)</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        mentor.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {mentor.availability}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all duration-200 ${
                    isLiked ? 'bg-red-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Heart className="w-5 h-5" />
                  </motion.button>
                  <motion.button onClick={() => setIsBookmarked(!isBookmarked)} className={`p-3 rounded-full transition-all duration-200 ${
                    isBookmarked ? 'bg-amber-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-amber-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Bookmark className="w-5 h-5" />
                  </motion.button>
                  <motion.button className={`p-3 rounded-full transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mentor.bio}</p>

              {/* Expertise */}
              <div className="mb-6">
                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span key={skill} className={`px-4 py-2 rounded-full font-medium ${
                      isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <div className="font-bold">{mentor.responseTime}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Response Time</div>
                </div>
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold">{mentor.location}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</div>
                </div>
                <div className="text-center">
                  <Globe className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <div className="font-bold">{mentor.languages.join(', ')}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Languages</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="font-bold">{mentor.sessions}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</div>
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              
              <h3 className={`font-bold text-xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Reviews</h3>
              <div className="space-y-4">
                {mentor.reviews.map((review, i) => (
                  <motion.div key={i} className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{review.name}</div>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{review.date}</span>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              
              <div className="text-center mb-6">
                <div className="font-bold text-3xl text-blue-500 mb-1">${mentor.hourlyRate}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>per hour</div>
              </div>

              <div className="space-y-3 mb-6">
                <motion.button className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Calendar className="w-5 h-5" />
                  <span>Book Session</span>
                </motion.button>
                
                <motion.button className={`w-full border-2 border-blue-500 text-blue-500 font-semibold py-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button className={`border font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </motion.button>
                  <motion.button className={`border font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </motion.button>
                </div>
              </div>

              <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Usually responds in {mentor.responseTime}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              
              <h3 className={`font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Award className="w-5 h-5 text-amber-500" />
                <span>Achievements</span>
              </h3>
              <div className="space-y-3">
                {mentor.achievements.map((achievement, i) => (
                  <motion.div key={i} className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div className={`rounded-3xl p-6 shadow-2xl border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              
              <h3 className={`font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Education</span>
              </h3>
              <div className="space-y-3">
                {mentor.education.map((edu, i) => (
                  <motion.div key={i} className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{edu}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
