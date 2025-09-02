"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Globe,
  Linkedin,
  Twitter,
  X,
  Calendar,
  BookOpen,
} from "lucide-react";
import Modal, { ModalFooter } from "../../components/Modal";

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  image?: string;
  createdAt: string;
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

export default function StudentProfileModal({
  isOpen,
  onClose,
  studentId,
}: StudentProfileModalProps) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student profile
  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  const fetchStudentProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data.user);
      } else {
        throw new Error("Failed to fetch student profile");
      }
    } catch (error: any) {
      console.error("Error fetching student profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Student Profile"
      description="View student contact details and information"
      size="2xl"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Profile
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchStudentProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : student ? (
          <>
            {/* Profile Header */}
            <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
              <div className="flex-shrink-0">
                {student.image ? (
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    {getInitials(student.name)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {student.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  {student.institutionName || "No institution specified"}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(student.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href={`mailto:${student.email}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {student.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {student.phoneNumber && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a
                        href={`tel:${student.phoneNumber}`}
                        className="text-sm text-green-600 hover:text-green-700 transition-colors"
                      >
                        {student.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* LinkedIn */}
                {student.linkedinUrl && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        LinkedIn
                      </p>
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}

                {/* Twitter */}
                {student.twitterUrl && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Twitter
                      </p>
                      <a
                        href={student.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        @{student.twitterUrl.split("/").pop()}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {student.websiteUrl && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Website
                      </p>
                      <a
                        href={student.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Academic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Research Area */}
                {student.researchArea && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Research Area
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.researchArea}
                      </p>
                    </div>
                  </div>
                )}

                {/* Academic Level */}
                {student.academicLevel && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Academic Level
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.academicLevel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Institution */}
                {student.institutionName && (
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Institution
                      </p>
                      <p className="text-sm text-gray-600">
                        {student.institutionName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}
