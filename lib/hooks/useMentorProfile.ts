import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../stores/authStore";
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

export const useMentorProfile = () => {
  const user = useAtomValue(userAtom);
  const [profile, setProfile] = useState<MentorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch mentor profile
  const fetchProfile = async () => {
    if (user?.userType !== "MENTOR") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/mentor-profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data.mentorProfile);
    } catch (error: any) {
      console.error("Error fetching mentor profile:", error);
      toast.error("Failed to load mentor profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Update mentor profile
  const updateProfile = async (profileData: MentorProfileData) => {
    if (user?.userType !== "MENTOR") return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/user/mentor-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.mentorProfile);
      toast.success("Profile updated successfully!");
      return data.mentorProfile;
    } catch (error: any) {
      console.error("Error updating mentor profile:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Load profile on mount
  useEffect(() => {
    if (user?.userType === "MENTOR") {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    isLoading,
    isSaving,
    fetchProfile,
    updateProfile,
  };
};
