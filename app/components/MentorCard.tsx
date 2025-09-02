'use client';

import { useState } from 'react';
import { Star, MapPin, Clock, Users, MessageCircle, Heart, DollarSign, FileText, Edit, ArrowRight } from 'lucide-react';
import GradientButton from './ui/GradientButton';
import { Mentor } from '../../lib/types';
import { createMentorBookingAtom, sendMentorNotificationAtom } from '../../lib/stores/mentorStore';
import Modal, { ModalFooter, ModalSection } from './Modal';
import Link from 'next/link';
import { useSetAtom } from 'jotai/react';

interface MentorCardProps {
  mentor: Mentor;
  currentUserId: string;
  currentDocumentId?: string;
  showViewProfile?: boolean;
}

export default function MentorCard({ mentor, currentUserId, currentDocumentId, showViewProfile = true }: MentorCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<'edit' | 'write' | 'comment'>('comment');
  const [message, setMessage] = useState('');

  const createBooking = useSetAtom(createMentorBookingAtom);
  const sendNotification = useSetAtom(sendMentorNotificationAtom);

  const handleBookMentor = async () => {
    if (!currentDocumentId) {
      alert('Please select a document to book this mentor for.');
      return;
    }

    setIsBooking(true);
    
    try {
      const booking = await createBooking({
        userId: currentUserId,
        mentorId: mentor.id,
        documentId: currentDocumentId,
        status: 'pending',
        requestedAccess: selectedAccess,
        message: message.trim() || undefined
      });

      await sendNotification(mentor.id, 'booking_request');
      setShowBookingModal(false);
      setMessage('');
      alert('Booking request sent successfully! The mentor will be notified via email.');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const getAccessTypeDescription = (type: string) => {
    switch (type) {
      case 'edit':
        return 'Full editing access to your document';
      case 'write':
        return 'Can add new content and sections';
      case 'comment':
        return 'Can leave comments and suggestions';
      default:
        return '';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Header with avatar and basic info */}
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <img
                src={mentor.avatar || '/images/default-avatar.jpg'}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                mentor.isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {mentor.bio}
              </p>
            </div>
          </div>

          {/* Expertise tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                >
                  {skill}
                </span>
              ))}
              {mentor.expertise.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-md">
                  +{mentor.expertise.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Key details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>${mentor.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{mentor.availability.days.length} days available</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            {showViewProfile && (
              <Link
                href={`/user/mentors/${mentor.id}`}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={!mentor.isAvailable}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                mentor.isAvailable
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {mentor.isAvailable ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
        title={`Book ${mentor.name}`}
        size="lg"
      >
        <div className="space-y-6 bg-white">
          {/* Access Type Selection */}
          <ModalSection
            title="Access Level"
            description="Choose the level of access you want to grant to this mentor"
          >
            <div className="space-y-3">
              {(['comment', 'write', 'edit'] as const).map((type) => (
                <label key={type} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="accessType"
                    value={type}
                    checked={selectedAccess === type}
                    onChange={(e) => setSelectedAccess(e.target.value as any)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {type === 'edit' && <Edit className="w-4 h-4 text-blue-600" />}
                      {type === 'write' && <FileText className="w-4 h-4 text-green-600" />}
                      {type === 'comment' && <MessageCircle className="w-4 h-4 text-purple-600" />}
                      <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {getAccessTypeDescription(type)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </ModalSection>

          {/* Message */}
          <ModalSection
            title="Message (Optional)"
            description="Tell the mentor about your project and what you need help with"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your research project, specific challenges, and what you hope to achieve with mentor guidance..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white"
              rows={4}
            />
          </ModalSection>

          {/* Cost Estimate */}
          <ModalSection
            title="Cost Estimate"
            description="This is an estimate based on the mentor's hourly rate"
          >
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-medium">Hourly Rate:</span>
                <span className="font-semibold text-gray-900">${mentor.hourlyRate}/hour</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700 font-medium">Estimated Total:</span>
                <span className="font-semibold text-gray-900">$150-300</span>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                Final cost depends on time spent and mentor's assessment. Most projects require 2-4 hours of mentor time.
              </p>
            </div>
          </ModalSection>
        </div>

        <ModalFooter>
          <button
            onClick={() => setShowBookingModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <GradientButton
            onClick={handleBookMentor}
            disabled={isBooking}
            variant="primary"
            size="md"
          >
            {isBooking ? 'Sending...' : 'Send Request'}
          </GradientButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
