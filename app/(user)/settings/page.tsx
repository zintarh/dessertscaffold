"use client";

import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { User, Camera, Save, Edit3, X } from "lucide-react";
import { userAtom, updateUserProfileAtom, updateUserImageAtom, userRoleAtom } from '../../../lib/stores/authStore';
import toast from "react-hot-toast";
import MentorSettings from "../components/MentorSettings";


interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  avatar?: string;
}

export default function SettingsPage() {
  const user = useAtomValue(userAtom);
  const updateUser = useSetAtom(updateUserProfileAtom);
  const updateUserImage = useSetAtom(updateUserImageAtom);
  const userRole = useAtomValue(userRoleAtom);

  // Show different settings based on user type
  if (user?.userType === "MENTOR") {
    return <MentorSettings />;
  }

  // Student Settings Component
  function StudentSettings() {
    const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institutionName: "",
    researchArea: "",
    academicLevel: "",
    avatar: "/images/user1.jpg",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Populate profile data from user store
  useEffect(() => {
    if (user) {
      const userProfile: ProfileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        institutionName: user.institutionName || '',
        researchArea: user.researchArea || '',
        academicLevel: user.academicLevel || '',
        avatar: user.image || '/images/user1.jpg'
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, [user]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Update user profile via API
      await updateUser({
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        institutionName: editedProfile.institutionName,
        researchArea: editedProfile.researchArea,
        phone: editedProfile.phone,
        academicLevel: editedProfile.academicLevel,
      });

      // Update local profile state
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const result = await response.json();
      
      // Update local state
      const newAvatar = result.image;
      setProfile(prev => ({ ...prev, avatar: newAvatar }));
      setEditedProfile(prev => ({ ...prev, avatar: newAvatar }));
      
      // Update user atom with new image
      updateUserImage(newAvatar);
      
      toast.success('Profile image updated successfully!');
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Show loading state if user data is not yet loaded
  if (!user) {
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
            <h1 className="text-2xl font-normal text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account and preferences
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
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
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
                            disabled={isUploadingImage}
                          />
                        </label>
                        {isUploadingImage && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Profile Photo</p>
                  {isEditing && (
                    <p className="text-xs text-gray-400 mt-1">
                      Click camera icon to upload
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                      {profile.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border capitalize">
                      {userRole || 'Not specified'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      User type cannot be changed
                    </p>
                  </div>
                </div>

                {/* Contact & Personal Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.phone || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Level
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile.academicLevel || ""}
                        onChange={(e) =>
                          handleInputChange("academicLevel", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select academic level</option>
                        <option value="UNDERGRADUATE">Undergraduate</option>
                        <option value="MASTERS">Masters</option>
                        <option value="PHD">PhD</option>
                        <option value="POSTDOC">Postdoc</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {profile.academicLevel || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Academic Information Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.institutionName || ""}
                        onChange={(e) =>
                          handleInputChange("institutionName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.institutionName || "Not specified"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Area
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.researchArea || ""}
                        onChange={(e) =>
                          handleInputChange("researchArea", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.researchArea || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Account</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Account Created</h3>
                  <p className="text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-gray-900">Last Updated</h3>
                  <p className="text-sm text-gray-500">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-500">
                      Update your account password
                    </p>
                  </div>
                  <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }

  // Return the appropriate settings component
  return <StudentSettings />;
}
