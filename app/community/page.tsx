'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import GradientButton from "../components/ui/GradientButton";
import { availableMentorsAtom, searchMentorsAtom } from '../../lib/stores/mentorStore';
import { isAuthenticatedAtom, userAtom } from '../../lib/stores/authStore';
import MentorCard from '../components/MentorCard';
import { Search, Filter, Users, Clock, ArrowRight } from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'availability'>('price');

  const allMentors = useAtomValue(availableMentorsAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const currentUser = useAtomValue(userAtom);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/user/dashboard');
    }
  }, [isAuthenticated, router]);

  // Available expertise options
  const allExpertise = useMemo(() => {
    const expertiseSet = new Set<string>();
    allMentors.forEach(mentor => {
      mentor.expertise.forEach(exp => expertiseSet.add(exp));
    });
    return Array.from(expertiseSet).sort();
  }, [allMentors]);

  // Filter and search mentors
  const filteredMentors = useMemo(() => {
    let filtered = allMentors;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply expertise filter
    if (selectedExpertise.length > 0) {
      filtered = filtered.filter(mentor =>
        selectedExpertise.some(exp => mentor.expertise.includes(exp))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'availability':
          return a.availability.days.length - b.availability.days.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allMentors, searchQuery, selectedExpertise, sortBy]);

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise) 
        ? prev.filter(exp => exp !== expertise)
        : [...prev, expertise]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedExpertise([]);
    setSortBy('price');
  };

  // Show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Mentor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced academic mentors who can help you excel in your research and writing projects.
          </p>
          
          {/* Call to Action for Non-authenticated Users */}
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sign up to access the full mentor directory and start collaborating with experts.
              </p>
              <div className="flex space-x-3">
                <GradientButton
                  onClick={() => window.location.href = "/signup"}
                  variant="primary"
                  size="md"
                  className="flex-1 text-center"
                >
                  Sign Up
                </GradientButton>
                <a
                  href="/signin"
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
                      </div>
                      
        {/* Preview of Available Mentors */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Featured Mentors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMentors.slice(0, 3).map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                {/* Mentor Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={mentor.avatar || '/images/default-avatar.jpg'}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
                      </div>
                    </div>
                  </div>

                {/* Expertise */}
                <div className="px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">${mentor.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {mentor.availability.days.slice(0, 2).join(', ')} • {mentor.availability.hours.start} - {mentor.availability.hours.end}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 py-4 bg-gray-50">
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Sign Up to Book
                  </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How Mentor Booking Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Mentor</h3>
              <p className="text-gray-600">
                Browse our curated list of experienced mentors and find the perfect match for your project.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Access</h3>
              <p className="text-gray-600">
                Choose the level of access you want to grant and send a personalized request.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Once accepted, mentors can provide feedback, suggestions, and guidance on your work.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Research Journey?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of students who are already working with expert mentors
            </p>
            <a
              href="/signup"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </a>
        </div>
      </div>
      </div>
    </div>
  );
}
