"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../lib/stores/authStore";
import { MessageCircle, User, Clock, Mail, Send, ArrowLeft, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import StudentProfileModal from "../components/StudentProfileModal";

interface Message {
  id: string;
  subject?: string;
  body: string;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
    userType: string;
    institutionName?: string;
    researchArea?: string;
    academicLevel?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image?: string;
    userType: string;
    institutionName?: string;
    researchArea?: string;
    academicLevel?: string;
  };
}

export default function MyMessagesPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openProfileModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedStudentId(null);
  };

  // Filter messages based on active tab
  const filteredMessages = messages.filter(message => {
    if (activeTab === 'sent') {
      return message.sender.id === user?.id;
    } else {
      return message.receiver.id === user?.id;
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Messages</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Messages</h1>
                  <p className="text-gray-600">View your sent and received messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <span>{messages.length} total messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-lg mb-8">
          <div className="border-b border-gray-200/60">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'sent', label: 'Sent Messages', icon: Send },
                { id: 'received', label: 'Received Messages', icon: Mail }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'sent' | 'received')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tab.id === 'sent' 
                        ? messages.filter(m => m.sender.id === user?.id).length
                        : messages.filter(m => m.receiver.id === user?.id).length
                      }
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'sent' ? (
                <Send className="w-12 h-12 text-gray-400" />
              ) : (
                <Mail className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === 'sent' ? 'Sent' : 'Received'} Messages
            </h3>
            <p className="text-gray-600">
              {activeTab === 'sent' 
                ? "You haven't sent any messages yet."
                : "You haven't received any messages yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => {
              const otherUser = activeTab === 'sent' ? message.receiver : message.sender;
              const isUnread = message.status === 'unread' && activeTab === 'received';
              const isExpanded = expandedMessages.has(message.id);
              const shouldTruncate = message.body.length > 150;
              
              return (
                <div
                  key={message.id}
                  className={`bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 ${
                    isUnread ? 'border-blue-300 bg-blue-50/30' : ''
                  }`}
                >
                  {/* Compact Header - Always Visible */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => {
                      toggleMessageExpansion(message.id);
                      if (isUnread) markAsRead(message.id);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          {otherUser.image ? (
                            <img
                              src={otherUser.image}
                              alt={otherUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {otherUser.name}
                            </h3>
                            {isUnread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                            {/* View Profile button for mentors viewing student messages */}
                            {user?.userType === 'MENTOR' && activeTab === 'received' && otherUser.userType === 'STUDENT' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProfileModal(otherUser.id);
                                }}
                                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                title="View student profile"
                              >
                                <Eye className="w-3 h-3 text-blue-600" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            <span className="font-medium">{otherUser.institutionName}</span>
                            {otherUser.researchArea && (
                              <span> • {otherUser.researchArea}</span>
                            )}
                          </p>
                        </div>
                        
                        {message.subject && (
                          <h4 className="text-sm font-medium text-gray-900 mt-1 truncate">
                            {message.subject}
                          </h4>
                        )}
                        
                        <p className="text-sm text-gray-700 mt-1">
                          {isExpanded ? message.body : truncateText(message.body)}
                        </p>
                        
                        {shouldTruncate && !isExpanded && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            Click to read more...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content - Only when expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Full Message:</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {message.body}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>
                            {activeTab === 'sent' ? 'Sent to' : 'Received from'} {otherUser.name}
                          </span>
                          <span>
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudentId && (
        <StudentProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
          studentId={selectedStudentId}
        />
      )}
    </div>
  );
}
