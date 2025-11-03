"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../../lib/stores/authStore";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  Clock, 
  Building,
  GraduationCap,
  FileText,
  Eye,
  MessageCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WritingSpaceAccess {
  id: string;
  accessType: string;
  grantedAt: string;
  expiresAt: string | null;
  timeline: {
    id: string;
    title: string;
    documentType: string;
    startDate: string | null;
    completionDate: string | null;
    academicLevel: string | null;
    discipline: string | null;
    researchTopic: string | null;
    createdAt: string;
    sections: {
      id: string;
      title: string;
      duration: number | null;
      order: number | null;
    }[];
  };
  student: {
    id: string;
    name: string;
    email: string;
    institutionName: string;
    researchArea: string | null;
    academicLevel: string | null;
  };
}

export default function MentorWritingSpacesPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [writingSpaces, setWritingSpaces] = useState<WritingSpaceAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch writing spaces
  useEffect(() => {
    const fetchWritingSpaces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/writing-space-access?userType=mentor');
        if (!response.ok) {
          throw new Error('Failed to fetch writing spaces');
        }
        const data = await response.json();
        setWritingSpaces(data.writingSpaces);
      } catch (error: any) {
        console.error('Error fetching writing spaces:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userType === 'MENTOR') {
      fetchWritingSpaces();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case 'READ':
        return 'bg-blue-100 text-blue-800';
      case 'COMMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'EDIT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (documentType: string) => {
    switch (documentType) {
      case 'RESEARCH_TIMELINE':
        return <Calendar className="w-5 h-5" />;
      case 'DISSERTATION':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading writing spaces...</p>
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
            <BookOpen className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Writing Spaces</h3>
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
                  <h1 className="text-2xl font-bold text-gray-900">Writing Spaces</h1>
                  <p className="text-gray-600">Student writing spaces you have access to</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>{writingSpaces.length} accessible spaces</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Writing Spaces List */}
        {writingSpaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Writing Spaces Yet</h3>
            <p className="text-gray-600 mb-6">
              Students haven't invited you to any writing spaces yet. Share your invite codes to get started!
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Generate Invite Codes</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {writingSpaces.map((access) => (
              <div
                key={access.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                      {getDocumentTypeIcon(access.timeline.documentType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {access.timeline.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {access.timeline.documentType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessTypeColor(access.accessType)}`}>
                    {access.accessType}
                  </span>
                </div>

                {/* Student Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Student</span>
                  </div>
                  <div className="pl-6">
                    <p className="font-medium text-gray-900">{access.student.name}</p>
                    <p className="text-sm text-gray-600">{access.student.institutionName}</p>
                    {access.student.researchArea && (
                      <p className="text-sm text-gray-500">{access.student.researchArea}</p>
                    )}
                  </div>
                </div>

                {/* Timeline Info */}
                <div className="mb-4 space-y-2">
                  {access.timeline.academicLevel && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{access.timeline.academicLevel}</span>
                    </div>
                  )}
                  {access.timeline.discipline && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{access.timeline.discipline}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{access.timeline.sections.length} sections</span>
                  </div>
                </div>

                {/* Access Info */}
                <div className="mb-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Access granted:</span>
                    <span>{formatDate(access.grantedAt)}</span>
                  </div>
                  {access.expiresAt && (
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                      <span>Expires:</span>
                      <span>{formatDate(access.expiresAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  href={`/mentor/writing-spaces/${access.timeline.id}`}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Writing Space</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
