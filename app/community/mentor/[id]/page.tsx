'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '../../../contexts/ThemeContext';
import Modal, { ModalFooter, ModalSection } from '../../../components/Modal';
import {
  ArrowLeft, Star, MapPin, Clock, Users, MessageCircle, Heart,
  Award, Share2, Bookmark, Calendar, Globe, CheckCircle, BookOpen
} from 'lucide-react';

export default function MentorDetailsPage() {
  const params = useParams();
  const { isDarkMode } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '1',
    topic: '',
    notes: ''
  });

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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the booking to your backend
    console.log('Booking submitted:', { mentor: mentor.name, ...bookingData });
    setShowBookingModal(false);
    // Reset form
    setBookingData({
      date: '',
      time: '',
      duration: '1',
      topic: '',
      notes: ''
    });
  };

  return (
    <div className={`min-h-screen font-['Urbanist'] ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    }`}>
      
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/community" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gray-800/50 group-hover:bg-gray-700 transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Community</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className={`rounded-3xl p-8 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {mentor.avatar}
                    </div>
                    {mentor.isOnline && <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" />}
                    {mentor.isVerified && <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>}
                  </div>
                  
                  <div>
                    <h1 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mentor.name}</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mentor.title}</p>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{mentor.institution}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl transition-colors duration-200 ${
                      isLiked ? 'bg-red-500 text-white' : 
                      isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-xl transition-colors duration-200 ${
                      isBookmarked ? 'bg-amber-500 text-white' : 
                      isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-amber-500 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{mentor.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{mentor.sessions} sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{mentor.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{mentor.responseTime}</span>
                </div>
              </div>

              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mentor.bio}</p>
            </div>

            {/* Expertise */}
            <div className={`rounded-3xl p-6 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <h3 className={`font-bold text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Areas of Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {mentor.expertise.map((skill) => (
                  <span key={skill} className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className={`rounded-3xl p-6 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <h3 className={`font-bold text-xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Student Reviews</h3>
              <div className="space-y-4">
                {mentor.reviews.map((review, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{review.name}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className={`rounded-3xl p-6 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <div className="text-center mb-6">
                <div className="font-bold text-3xl text-blue-500 mb-1">${mentor.hourlyRate}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>per hour</div>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-emerald-600 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Session</span>
                </button>
                
                <button className={`w-full border-2 border-blue-500 text-blue-500 font-semibold py-3 rounded-xl hover:bg-blue-500 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2`}>
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Usually responds in {mentor.responseTime}
              </div>
            </div>

            {/* Achievements */}
            <div className={`rounded-3xl p-6 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <h3 className={`font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Award className="w-5 h-5 text-amber-500" />
                <span>Achievements</span>
              </h3>
              <div className="space-y-3">
                {mentor.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className={`rounded-3xl p-6 shadow-lg border backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
              
              <h3 className={`font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Education</span>
              </h3>
              <div className="space-y-3">
                {mentor.education.map((edu, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{edu}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
        title={`Book Session with ${mentor.name}`}
        size="md"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date
            </label>
            <input
              type="date"
              required
              value={bookingData.date}
              onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Time
            </label>
            <input
              type="time"
              required
              value={bookingData.time}
              onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Duration (hours)
            </label>
            <select
              value={bookingData.duration}
              onChange={(e) => setBookingData(prev => ({ ...prev, duration: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Topic/Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Research methodology, Paper review"
              value={bookingData.topic}
              onChange={(e) => setBookingData(prev => ({ ...prev, topic: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any specific questions or topics you'd like to discuss..."
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Cost:</span>
              <span className="font-bold text-lg text-blue-500">
                ${mentor.hourlyRate * parseInt(bookingData.duration)}
              </span>
            </div>
          </div>
        </form>

        <ModalFooter>
          <button
            type="button"
            onClick={() => setShowBookingModal(false)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleBookingSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Session
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
