"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Star, MessageSquare, Download, Edit3, Users, Calendar, FileText } from "lucide-react";
import TipTapEditor from "../../components/TipTapEditor";

interface SharedDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  lastModified: string;
  sharedBy: string;
  sharedDate: string;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canDownload: boolean;
  };
  comments: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
    replies?: Array<{
      id: string;
      author: string;
      authorAvatar: string;
      content: string;
      timestamp: string;
    }>;
  }>;
}

export default function SharedDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<SharedDocument['comments']>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Mock data for the shared document
  const document: SharedDocument = {
    id: params.id as string,
    title: "AI Ethics Research Proposal",
    content: `
      <h1>AI Ethics Research Proposal</h1>
      <p>This research explores the ethical implications of artificial intelligence in healthcare decision-making systems.</p>
      <h2>Research Questions</h2>
      <ul>
        <li>How do AI systems make ethical decisions in healthcare?</li>
        <li>What are the potential biases in AI healthcare algorithms?</li>
        <li>How can we ensure transparency in AI decision-making?</li>
      </ul>
      <h2>Methodology</h2>
      <p>We will conduct a mixed-methods study combining:</p>
      <ul>
        <li>Literature review of existing AI ethics frameworks</li>
        <li>Case studies of AI healthcare implementations</li>
        <li>Interviews with healthcare professionals and ethicists</li>
      </ul>
    `,
    type: "Research Proposal",
    status: "In Progress",
    lastModified: "2024-01-15",
    sharedBy: "Dr. Sarah Johnson",
    sharedDate: "2024-01-10",
    permissions: {
      canEdit: true,
      canComment: true,
      canDownload: true,
    },
    comments: [],
  };

  // Initialize comments from mock data
  const initialComments: SharedDocument['comments'] = [
    {
      id: "1",
      author: "Dr. Michael Chen",
      authorAvatar: "MC",
      content: "Excellent research questions. Consider adding a section on regulatory compliance.",
      timestamp: "2024-01-12",
      replies: [
        {
          id: "You",
          author: "You",
          authorAvatar: "AT",
          content: "Great point! I'll add that section. Do you have any specific regulatory frameworks in mind?",
          timestamp: "2024-01-13",
        }
      ]
    },
    {
      id: "2",
      author: "Prof. Emily Rodriguez",
      authorAvatar: "ER",
      content: "The methodology looks solid. Have you considered the impact care AI applications.",
      timestamp: "2024-01-14",
    },
    
  ];

  // Initialize comments on component mount
  useEffect(() => {
    setComments(initialComments);
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now().toString(),
        author: "Alex Thompson",
        authorAvatar: "AT",
        content: newComment.trim(),
        timestamp: new Date().toLocaleDateString(),
      };
      
      setComments(prev => [...prev, newCommentObj]);
      setNewComment("");
    }
  };

  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const newReply = {
        id: `${commentId}-${Date.now()}`,
        author: "Alex Thompson",
        authorAvatar: "AT",
        content: replyContent.trim(),
        timestamp: new Date().toLocaleDateString(),
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              replies: [...(comment.replies || []), newReply] 
            }
          : comment
      ));
      
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      setReplyContent("");
    }
  };

  const handleUpdate = (content: string) => {
    console.log("Document updated:", content);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
              <p className="text-sm text-gray-500">
                Shared with you by {document.sharedBy} on {document.sharedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Star className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Info Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{document.sharedBy}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last modified: {document.lastModified}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{document.type}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {document.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Content</h2>
              
              {document.permissions.canEdit ? (
                <TipTapEditor
                  content={document.content}
                  onUpdate={handleUpdate}
                  placeholder="Start writing your document..."
                />
              ) : (
                <div 
                  className="prose max-w-none text-gray-900"
                  dangerouslySetInnerHTML={{ __html: document.content }}
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Ethics Research Proposal</h1>
                  <p className="text-gray-900 mb-4">This research explores the ethical implications of artificial intelligence in healthcare decision-making systems.</p>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Research Questions</h2>
                  <ul className="list-disc pl-6 mb-4 text-gray-900">
                    <li>How do AI systems make ethical decisions in healthcare?</li>
                    <li>What are the potential biases in AI healthcare algorithms?</li>
                    <li>How can we ensure transparency in AI decision-making?</li>
                  </ul>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Methodology</h2>
                  <p className="text-gray-900 mb-4">We will conduct a mixed-methods study combining:</p>
                  <ul className="list-disc pl-6 text-gray-900">
                    <li>Literature review of existing AI ethics frameworks</li>
                    <li>Case studies of AI healthcare implementations</li>
                    <li>Interviews with healthcare professionals and ethicists</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {comments.length} comments
                </span>
              </div>

              {/* Comments List */}
              <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Main Comment */}
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {comment.authorAvatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                        
                        {/* Reply Button */}
                        <div className="mt-2 flex items-center space-x-4">
                          <button 
                            onClick={() => handleReplyClick(comment.id)}
                            className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            Reply
                          </button>
                          <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                            Like
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="ml-11">
                        <form onSubmit={(e) => handleReplySubmit(comment.id, e)} className="space-y-3">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                AT
                              </div>
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                rows={2}
                              />
                              <div className="mt-2 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setReplyingTo(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 font-medium text-xs"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-11 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {reply.authorAvatar}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                                  <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              {document.permissions.canComment && (
                <div className="border-t border-gray-200 pt-4">
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          AT
                        </div>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.ctrlKey && e.key === 'Enter') {
                              handleCommentSubmit(e);
                            }
                          }}
                          placeholder="Add a comment..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                          rows={3}
                        />
                        <div className="mt-2 flex items-center justify-between">
                          
                          <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 font-medium text-sm"
                          >
                            Add Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          color: #111827;
          font-size: 16px;
          line-height: 1.6;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #111827;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        .ProseMirror p {
          margin-bottom: 1rem;
          color: #111827;
        }
        .ProseMirror ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: #111827;
        }
        .ProseMirror ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: #111827;
        }
        .ProseMirror li {
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        .ProseMirror strong {
          font-weight: 600;
          color: #111827;
        }
        .ProseMirror em {
          font-style: italic;
          color: #111827;
        }
      `}</style>
    </div>
  );
}
