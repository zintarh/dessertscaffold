"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../../lib/stores/authStore";
import { 
  ArrowLeft, 
  Plus, 
  Copy, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  AlertCircle,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface InviteCode {
  id: string;
  code: string;
  isUsed: boolean;
  expiresAt: string | null;
  createdAt: string;
  usedAt: string | null;
  student: {
    id: string;
    name: string;
    email: string;
    institutionName: string;
  } | null;
}

export default function MentorInviteCodesPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCodeId, setDeletingCodeId] = useState<string | null>(null);

  // Fetch invite codes
  const fetchInviteCodes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/invite-codes');
      if (response.ok) {
        const data = await response.json();
        setInviteCodes(data.inviteCodes);
      } else {
        throw new Error('Failed to fetch invite codes');
      }
    } catch (error: any) {
      console.error('Error fetching invite codes:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteCode = async () => {
    setIsGeneratingCode(true);
    try {
      const response = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiresInDays,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Invite code generated successfully!');
        await fetchInviteCodes(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate invite code');
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
      toast.error('Failed to generate invite code');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Invite code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy invite code');
    }
  };

  const deleteInviteCode = async (codeId: string) => {
    // Use toast for confirmation instead of browser alert
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col space-y-3">
          <div className="font-medium text-gray-900">Delete Invite Code</div>
          <div className="text-sm text-gray-600">
            Are you sure you want to delete this invite code? This action cannot be undone.
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity, // Keep toast open until user responds
      });
    });

    if (!confirmed) {
      return;
    }

    setDeletingCodeId(codeId);
    try {
      const response = await fetch(`/api/invite-codes?id=${codeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Invite code deleted successfully!');
        await fetchInviteCodes(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete invite code');
      }
    } catch (error) {
      console.error('Error deleting invite code:', error);
      toast.error('Failed to delete invite code');
    } finally {
      setDeletingCodeId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const getStatusColor = (inviteCode: InviteCode) => {
    if (inviteCode.isUsed) return 'bg-green-50 border-green-200';
    if (isExpired(inviteCode.expiresAt)) return 'bg-red-50 border-red-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusIcon = (inviteCode: InviteCode) => {
    if (inviteCode.isUsed) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isExpired(inviteCode.expiresAt)) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const getStatusText = (inviteCode: InviteCode) => {
    if (inviteCode.isUsed) return 'Used';
    if (isExpired(inviteCode.expiresAt)) return 'Expired';
    return 'Active';
  };

  const getStatusTextColor = (inviteCode: InviteCode) => {
    if (inviteCode.isUsed) return 'text-green-700';
    if (isExpired(inviteCode.expiresAt)) return 'text-red-700';
    return 'text-blue-700';
  };

  // Fetch invite codes on component mount
  useEffect(() => {
    if (user?.userType === 'MENTOR') {
      fetchInviteCodes();
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invite codes...</p>
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
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Invite Codes</h3>
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
                  <h1 className="text-2xl font-bold text-gray-900">Invite Codes</h1>
                  <p className="text-gray-600">Generate and manage codes to invite students to your writing spaces</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{inviteCodes.length} total codes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {inviteCodes.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generate New Invite Code</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create a unique code to share with students for writing space access
                </p>
              </div>
              <button
                onClick={generateInviteCode}
                disabled={isGeneratingCode}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGeneratingCode ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span className="font-medium">{isGeneratingCode ? 'Generating...' : 'Generate Code'}</span>
              </button>
            </div>

            {/* Expiration Settings */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Expiration
              </label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Choose how long the invite code will remain valid
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Invite Codes List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Invite Codes</h2>
             
            </div>

            {inviteCodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Invite Codes Yet</h3>
                <p className="text-gray-600 mb-6">
                  Generate your first invite code to start collaborating with students
                </p>
                <button
                  onClick={generateInviteCode}
                  disabled={isGeneratingCode}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isGeneratingCode ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Generate Your First Code</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {inviteCodes.map((inviteCode) => (
                  <div
                    key={inviteCode.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getStatusColor(inviteCode)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(inviteCode)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-mono text-2xl font-bold text-gray-900 tracking-wider">
                              {inviteCode.code}
                            </span>
                            <button
                              onClick={() => copyToClipboard(inviteCode.code)}
                              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created: {formatDate(inviteCode.createdAt)}</span>
                            </div>
                            {inviteCode.expiresAt && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Expires: {formatDate(inviteCode.expiresAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`flex items-center space-x-2 mb-2 ${getStatusTextColor(inviteCode)}`}>
                          {getStatusIcon(inviteCode)}
                          <span className="font-medium">{getStatusText(inviteCode)}</span>
                        </div>
                        {inviteCode.student && (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Used by: {inviteCode.student.name}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {inviteCode.student.institutionName}
                            </div>
                          </div>
                        )}
                        
                        {/* Delete Button - Only show for unused codes */}
                        {!inviteCode.isUsed && !isExpired(inviteCode.expiresAt) && (
                          <div className="mt-3">
                            <button
                              onClick={() => deleteInviteCode(inviteCode.id)}
                              disabled={deletingCodeId === inviteCode.id}
                              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete invite code"
                            >
                              {deletingCodeId === inviteCode.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              <span>{deletingCodeId === inviteCode.id ? 'Deleting...' : 'Delete'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section - Only show when there are invite codes */}
        {inviteCodes.length > 0 && (
          <div className="mt-8 bg-blue-50/80 backdrop-blur-md rounded-2xl border border-blue-200/60 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use Invite Codes</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>1. <strong>Generate a code</strong> with your preferred expiration time</p>
                  <p>2. <strong>Share the code</strong> with students via email, message, or in person</p>
                  <p>3. <strong>Students enter the code</strong> in their writing space to grant you access</p>
                  <p>4. <strong>You can view</strong> their writing spaces in the Writing Spaces section</p>
                  <p>5. <strong>Provide feedback</strong> and collaborate on their research</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
