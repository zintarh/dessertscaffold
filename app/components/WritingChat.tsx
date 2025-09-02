"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Edit2, Trash2, MessageCircle, Users, ChevronRight, ChevronDown, Edit3 } from 'lucide-react';
import GradientButton from './ui/GradientButton';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: "student" | "mentor";
    avatar?: string;
  };
  timestamp: Date;
  isEdited?: boolean;
  replies?: ChatMessage[];
}

interface WritingChatProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  timelineId: string;
  sectionId: string;
  currentUser: {
    id: string;
    name: string;
    role: "student" | "mentor";
  };
}

export default function WritingChat({
  isVisible,
  onToggleVisibility,
  timelineId,
  sectionId,
  currentUser,
}: WritingChatProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    // Sample messages for demonstration
    {
      id: "1",
      content: "Great start on the abstract! Consider adding a brief mention of your methodology.",
      sender: {
        id: "mentor1",
        name: "Dr. Smith",
        role: "mentor",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      content: "Thanks! I'll add that. What do you think about the length?",
      sender: {
        id: "student1",
        name: "John Doe",
        role: "student",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: "3",
      content: "The length is perfect for an abstract. Keep it concise and focused.",
      sender: {
        id: "mentor1",
        name: "Dr. Smith",
        role: "mentor",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcut to toggle chat (Ctrl/Cmd + M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault();
        onToggleVisibility();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggleVisibility]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        sender: currentUser,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content, isEdited: true }
          : msg
      )
    );
    setEditingMessage(null);
    setEditContent("");
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const startEditing = (message: ChatMessage) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // If chat is not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sticky top-8">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Expand chat (Ctrl+M)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Quick Chat Summary in Collapsed Mode */}
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Chat</div>
            <div className="text-lg font-bold text-blue-600">
              {messages.length}
            </div>
            <div className="text-xs text-gray-400">messages</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-1">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-[600px] flex flex-col sticky top-8">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Writing Chat</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Ctrl+M
            </span>
          </div>
          <button
            onClick={onToggleVisibility}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Hide chat (Ctrl+M)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.sender.id === currentUser.id ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  message.sender.role === "mentor" 
                    ? "bg-purple-100 text-purple-600" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {message.sender.avatar ? (
                    <img 
                      src={message.sender.avatar} 
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    message.sender.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-xs ${
                message.sender.id === currentUser.id ? "text-right" : ""
              }`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${
                  message.sender.id === currentUser.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}>
                  {editingMessage === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 text-sm border rounded resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <GradientButton
                          onClick={() => handleEditMessage(message.id, editContent)}
                          variant="primary"
                          size="sm"
                        >
                          Save
                        </GradientButton>
                        <button
                          onClick={() => setEditingMessage(null)}
                          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">{message.content}</p>
                      {message.isEdited && (
                        <span className="text-xs opacity-70">(edited)</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Message Actions */}
                <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-500 ${
                  message.sender.id === currentUser.id ? "justify-end" : ""
                }`}>
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.sender.id === currentUser.id && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditing(message)}
                        className="hover:text-blue-600 transition-colors"
                        title="Edit message"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="hover:text-red-600 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <GradientButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              variant="primary"
              size="md"
              className="px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}
