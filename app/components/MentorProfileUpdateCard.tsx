'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@/lib/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AlertCircle, Settings, Users } from 'lucide-react';

/**
 * Mentor Profile Update Card Component
 * Displays a notification card for mentors who need to complete their profile
 * to appear in the student dashboard
 */

export function MentorProfileUpdateCard() {
  const router = useRouter();
  const currentUser = useAtomValue(currentUserAtom);
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch mentor profile data
  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (!currentUser || currentUser.userType !== 'MENTOR') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/mentor-profile');
        if (response.ok) {
          const data = await response.json();
          setMentorProfile(data.mentorProfile);
        }
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorProfile();
  }, [currentUser]);

  // Check if mentor profile is incomplete
  const isProfileIncomplete = () => {
    if (!currentUser || currentUser.userType !== 'MENTOR') return false;
    
    // Check basic User fields
    const basicFieldsIncomplete = [
      currentUser.researchArea,
      currentUser.institutionName,
      currentUser.image
    ].some(field => !field || field.trim() === '');

    // Check MentorProfile fields
    const mentorFieldsIncomplete = !mentorProfile || 
      !mentorProfile.bio || 
      !mentorProfile.expertise || 
      mentorProfile.expertise.length === 0 ||
      !mentorProfile.specializations ||
      mentorProfile.specializations.length === 0;
    
    return basicFieldsIncomplete || mentorFieldsIncomplete;
  };

  // Don't show card if loading, not a mentor, or profile is complete
  if (isLoading || !currentUser || currentUser.userType !== 'MENTOR' || !isProfileIncomplete()) {
    return null;
  }

  const handleUpdateProfile = () => {
    router.push('/user/settings');
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-lg text-amber-800">
            Complete Your Mentor Profile
          </CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Your profile is incomplete and won't appear to students looking for mentors.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Missing Information
              </p>
              <p className="text-sm text-amber-700">
                Complete your research area, institution, and profile photo to be visible to students.
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleUpdateProfile}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Update Profile Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
