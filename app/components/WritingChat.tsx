"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Edit2,
  Trash2,
  MessageCircle,
  Users,
  ChevronRight,
  ChevronDown,
  Edit3,
} from "lucide-react";
import GradientButton from "./ui/GradientButton";

interface ChatMessage {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    userType: "STUDENT" | "MENTOR";
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
  timelineId: string;
  sectionId?: string;
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch comments/messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, [timelineId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/timelines/${timelineId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut to toggle chat (Ctrl/Cmd + M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        onToggleVisibility();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onToggleVisibility]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await fetch(`/api/timelines/${timelineId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newMessage.trim(),
            sectionId: sectionId || undefined,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages((prev) => [...prev, data.comment]);
          setNewMessage("");
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`/api/timelines/${timelineId}/comments/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...data.comment, isEdited: true } : msg
          )
        );
        setEditingMessage(null);
        setEditContent("");
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/timelines/${timelineId}/comments/${messageId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const startEditing = (message: ChatMessage) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const formatTimestamp = (createdAt: string) => {
    const now = new Date();
    const timestamp = new Date(createdAt);
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isCollapsed) {
    return (
      <div className="h-full">
        <div className="h-full p-3">
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
    <div className="h-full">
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Feeback</h3>
            
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No feedback yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.author.id === currentUser.id
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.author.userType === "MENTOR"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {message.author.image ? (
                    <img
                      src={message.author.image}
                      alt={message.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    message.author.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 max-w-xs ${
                  message.author.id === currentUser.id ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.author.id === currentUser.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {editingMessage === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 text-sm border rounded resize-none text-gray-900 bg-white"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <GradientButton
                          onClick={() =>
                            handleEditMessage(message.id, editContent)
                          }
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
                <div
                  className={`flex items-center space-x-2 mt-1 text-xs ${
                    message.author.id === currentUser.id ? "justify-end" : ""
                  }`}
                >
                  <span className="text-gray-500">{formatTimestamp(message.createdAt)}</span>
                  {/* Debug: Show user IDs for troubleshooting */}
                  {process.env.NODE_ENV === 'development' && (
                    <span className="text-xs text-red-500 ml-2">
                      Author: {message.author.id} | Current: {currentUser.id}
                    </span>
                  )}
                  {/* Always show buttons for testing - remove this condition temporarily */}
                  <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => startEditing(message)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit message"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this message?')) {
                            handleDeleteMessage(message.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                </div>
              </div>
            </div>
            ))
          )}
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
