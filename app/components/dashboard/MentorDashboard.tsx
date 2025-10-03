'use client';

import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import toast from 'react-hot-toast';

import { Check, X, Clock, Calendar, User, MessageCircle, Edit, FileText } from 'lucide-react';
import { MentorBooking } from '@/lib/types';
import {  mentorBookingsByMentorAtom, sendMentorNotificationAtom, updateMentorBookingStatusAtom } from '@/lib/stores/mentorStore';
import GradientButton from '../ui/GradientButton';


interface MentorDashboardProps {
  mentorId: string;
}

export default function MentorDashboard({ mentorId }: MentorDashboardProps) {
  const [selectedBooking, setSelectedBooking] = useState<MentorBooking | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const bookings = useAtomValue(mentorBookingsByMentorAtom)(mentorId);
  const updateBookingStatus = useSetAtom(updateMentorBookingStatusAtom);
  const sendNotification = useSetAtom(sendMentorNotificationAtom);

  const handleRespondToBooking = async (booking: MentorBooking, status: 'accepted' | 'rejected') => {
    setSelectedBooking(booking);
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!selectedBooking) return;

    setIsResponding(true);
    
    try {
      await updateBookingStatus(selectedBooking.id, selectedBooking.status === 'accepted' ? 'accepted' : 'rejected');
      
      // Send email notification to user
      await sendNotification(selectedBooking.userId, 
        selectedBooking.status === 'accepted' ? 'booking_accepted' : 'booking_rejected'
      );
      
      setShowResponseModal(false);
      setSelectedBooking(null);
      setResponseMessage('');
      
      toast.success(`Booking ${selectedBooking.status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking. Please try again.');
    } finally {
      setIsResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessIcon = (accessType: string) => {
    switch (accessType) {
      case 'edit':
        return <Edit className="w-4 h-4" />;
      case 'write':
        return <FileText className="w-4 h-4" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getAccessTypeDescription = (type: string) => {
    switch (type) {
      case 'edit':
        return 'Full editing access';
      case 'write':
        return 'Can add new content';
      case 'comment':
        return 'Comment only';
      default:
        return '';
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'accepted');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentor Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingBookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Active Projects</p>
                <p className="text-2xl font-bold text-green-900">{activeBookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">Completed</p>
                <p className="text-2xl font-bold text-blue-900">{completedBookings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">User ID: {booking.userId}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">Document ID: {booking.documentId}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      {getAccessIcon(booking.requestedAccess)}
                      <span className="text-sm font-medium text-gray-900">
                        {getAccessTypeDescription(booking.requestedAccess)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    {booking.message && (
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <p className="text-sm text-gray-700">{booking.message}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Requested on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <GradientButton
                      onClick={() => handleRespondToBooking(booking, 'accepted')}
                      variant="success"
                      size="md"
                      className="flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </GradientButton>
                    <GradientButton
                      onClick={() => handleRespondToBooking(booking, 'rejected')}
                      variant="danger"
                      size="md"
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </GradientButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Projects */}
      {activeBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">User ID: {booking.userId}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">Document ID: {booking.documentId}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      {getAccessIcon(booking.requestedAccess)}
                      <span className="text-sm font-medium text-gray-900">
                        {getAccessTypeDescription(booking.requestedAccess)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Accepted on {new Date(booking.acceptedAt!).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <GradientButton
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      variant="primary"
                      size="md"
                    >
                      Mark Complete
                    </GradientButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedBooking.status === 'accepted' ? 'Accept' : 'Reject'} Booking Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (Optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={`Add a message for the user...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowResponseModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <GradientButton
                type="submit"
                disabled={isResponding}
                variant={selectedBooking.status === 'accepted' ? 'success' : 'danger'}
                size="lg"
                className="flex-1"
              >
                {isResponding ? 'Processing...' : (selectedBooking.status === 'accepted' ? 'Accept' : 'Reject')}
              </GradientButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
