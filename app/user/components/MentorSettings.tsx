"use client";

import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { User, Camera, Save, Edit3, X } from "lucide-react";
import { userAtom, updateUserImageAtom } from "../../../lib/stores/authStore";
import toast from "react-hot-toast";

interface MentorProfileData {
  bio: string;
  expertise: string[];
  hourlyRate: number;
  availability: string;
  responseTime: string;
  languages: string[];
  timezone: string;
  education: string[];
  publications: string[];
  specializations: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
  };
}



const EXPERTISE_OPTIONS = [
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Computer Vision",
  "Natural Language Processing",
  "Deep Learning",
  "Statistics",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Psychology",
  "Economics",
  "Business",
  "Engineering",
  "Environmental Science",
  "Social Sciences",
  "Humanities",
  "Other"
];

const SPECIALIZATION_OPTIONS = [
  "Research Methodology",
  "Academic Writing",
  "Data Analysis",
  "Statistical Analysis",
  "Literature Review",
  "Thesis/Dissertation Guidance",
  "Career Development",
  "Grant Writing",
  "Publication Strategy",
  "Presentation Skills",
  "Time Management",
  "Project Management"
];

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Hindi",
  "Other"
];

// Simple MultiSelect component
function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className = "",
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(value.filter((item) => item !== option));
  };

  return (
    <div className={`w-full relative ${className}`}>
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length > 0 ? (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <div className="ml-2">
          <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value.includes(option) && (
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default function MentorSettings() {
  const user = useAtomValue(userAtom);
  const updateUserImage = useSetAtom(updateUserImageAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState<MentorProfileData>({
    bio: "",
    expertise: [],
    hourlyRate: 50,
    availability: "Available",
    responseTime: "24-48 hours",
    languages: ["English"],
    timezone: "UTC",
    education: [],
    publications: [],
    specializations: [],
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
      website: "",
    },
  });

  // Fetch mentor profile data on component mount
  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/mentor-profile");
        
        if (response.ok) {
          const data = await response.json();
          if (data.mentorProfile) {
            setEditedProfile(data.mentorProfile);
          }
        } else if (response.status === 403) {
          // User is not a mentor, keep default values
          console.log("User is not a mentor");
        } else {
          console.error("Failed to fetch mentor profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
        toast.error("Failed to load mentor profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMentorProfile();
    }
  }, [user]);



  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/mentor-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();
      if (result.mentorProfile) {
        setEditedProfile(result.mentorProfile);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating mentor profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      await updateUserImage(file);
      toast.success('Profile image updated successfully!');
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const addEducation = () => {
    setEditedProfile({
      ...editedProfile,
      education: [...editedProfile.education, ""],
    });
  };

  const removeEducation = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      education: editedProfile.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, value: string) => {
    const newEducation = [...editedProfile.education];
    newEducation[index] = value;
    setEditedProfile({
      ...editedProfile,
      education: newEducation,
    });
  };

  const addPublication = () => {
    setEditedProfile({
      ...editedProfile,
      publications: [...editedProfile.publications, ""],
    });
  };

  const removePublication = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      publications: editedProfile.publications.filter((_, i) => i !== index),
    });
  };

  const updatePublication = (index: number, value: string) => {
    const newPublications = [...editedProfile.publications];
    newPublications[index] = value;
    setEditedProfile({
      ...editedProfile,
      publications: newPublications,
    });
  };



  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-gray-900">Mentor Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your mentor profile and preferences
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <label className="cursor-pointer p-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Profile Photo</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {user.name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {user.institutionName || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Area
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {user.researchArea || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Profile Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Mentor Profile
            </h2>

            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Describe your research background, expertise, and mentoring approach..."
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {editedProfile.bio || "No bio provided"}
                  </p>
                )}
              </div>

              {/* Expertise Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise *
                </label>
                {isEditing ? (
                  <MultiSelect
                    options={EXPERTISE_OPTIONS}
                    value={editedProfile.expertise}
                    onChange={(value) => setEditedProfile({ ...editedProfile, expertise: value })}
                    placeholder="Select your areas of expertise..."
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.expertise && editedProfile.expertise.length > 0 ? (
                      editedProfile.expertise.map((expertise) => (
                        <span key={expertise} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {expertise}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No expertise areas selected</span>
                    )}
                  </div>
                )}
              </div>

              {/* Hourly Rate and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (USD) *
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile.hourlyRate}
                      onChange={(e) => setEditedProfile({ ...editedProfile, hourlyRate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      ${editedProfile.hourlyRate}/hour
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.availability}
                      onChange={(e) => setEditedProfile({ ...editedProfile, availability: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Limited">Limited</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {editedProfile.availability}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Time *
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.responseTime}
                      onChange={(e) => setEditedProfile({ ...editedProfile, responseTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="1-2 hours">1-2 hours</option>
                      <option value="2-4 hours">2-4 hours</option>
                      <option value="24-48 hours">24-48 hours</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {editedProfile.responseTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages *
                </label>
                {isEditing ? (
                  <MultiSelect
                    options={LANGUAGE_OPTIONS}
                    value={editedProfile.languages}
                    onChange={(value) => setEditedProfile({ ...editedProfile, languages: value })}
                    placeholder="Select languages you speak..."
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.languages && editedProfile.languages.length > 0 ? (
                      editedProfile.languages.map((language) => (
                        <span key={language} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                          {language}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No languages selected</span>
                    )}
                  </div>
                )}
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mentoring Specializations *
                </label>
                {isEditing ? (
                  <MultiSelect
                    options={SPECIALIZATION_OPTIONS}
                    value={editedProfile.specializations}
                    onChange={(value) => setEditedProfile({ ...editedProfile, specializations: value })}
                    placeholder="Select your mentoring specializations..."
                    className="w-full"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.specializations && editedProfile.specializations.length > 0 ? (
                      editedProfile.specializations.map((specialization) => (
                        <span key={specialization} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {specialization}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No specializations selected</span>
                    )}
                  </div>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedProfile.education.map((edu, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={edu}
                          onChange={(e) => updateEducation(index, e.target.value)}
                          placeholder="e.g., PhD in Computer Science, MIT"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    >
                      + Add Education
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editedProfile.education && editedProfile.education.length > 0 ? (
                      editedProfile.education.map((edu, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{edu}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">No education information provided</span>
                    )}
                  </div>
                )}
              </div>

              {/* Publications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publications
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedProfile.publications.map((pub, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={pub}
                          onChange={(e) => updatePublication(index, e.target.value)}
                          placeholder="e.g., Smith, J. (2023). AI in Healthcare. Nature."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => removePublication(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPublication}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    >
                      + Add Publication
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editedProfile.publications && editedProfile.publications.length > 0 ? (
                      editedProfile.publications.map((pub, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{pub}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500">No publications provided</span>
                    )}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile.socialLinks.linkedin}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          socialLinks: { ...editedProfile.socialLinks, linkedin: e.target.value }
                        })}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {editedProfile.socialLinks.linkedin || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Twitter
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile.socialLinks.twitter}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          socialLinks: { ...editedProfile.socialLinks, twitter: e.target.value }
                        })}
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {editedProfile.socialLinks.twitter || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      GitHub
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile.socialLinks.github}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          socialLinks: { ...editedProfile.socialLinks, github: e.target.value }
                        })}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {editedProfile.socialLinks.github || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile.socialLinks.website}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          socialLinks: { ...editedProfile.socialLinks, website: e.target.value }
                        })}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                    ) : (
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {editedProfile.socialLinks.website || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
