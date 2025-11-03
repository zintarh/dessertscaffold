"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X } from "lucide-react";
import { MentorData } from "@/types";

// Define the mentor type based on what the API actually returns
const disciplines = [
  "All Disciplines",
  "Computer Science",
  "Physics",
  "Psychology",
  "Economics",
  "Biology",
  "Chemistry",
  "Mathematics",
];
const levels = ["All Levels", "Undergraduate", "Masters", "PhD", "Postdoc"];

export default function CommunitiesPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<MentorData[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/mentors");
        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch mentors");
        }
        const data = await response.json();
        setMentors(data.mentors);
        setFilteredMentors(data.mentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        // Fallback to empty array
        setMentors([]);
        setFilteredMentors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, selectedDiscipline, selectedLevel, priceRange, mentors]);

  const filterMentors = () => {
    const filtered = mentors.filter((mentor) => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.researchArea
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        mentor.institutionName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesDiscipline =
        selectedDiscipline === "" ||
        selectedDiscipline === "All Disciplines" ||
        mentor.researchArea === selectedDiscipline;

      const matchesLevel =
        selectedLevel === "" ||
        selectedLevel === "All Levels" ||
        mentor.academicLevel === selectedLevel;

      const matchesPrice =
        mentor.hourlyRate &&
        mentor.hourlyRate >= priceRange[0] &&
        mentor.hourlyRate <= priceRange[1];

      return matchesSearch && matchesDiscipline && matchesLevel && matchesPrice;
    });

    setFilteredMentors(filtered);
  };

  const handleMentorClick = (mentorId: string) => {
    router.push(`/communities/${mentorId}`);
  };

  const handleMessageClick = (mentorId: string) => {
    router.push(`/communities/${mentorId}?tab=messages`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                    Find Your Mentor
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Connect with expert researchers and academics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        )}

        {/* Search and Filters */}
        {!isLoading && mentors.length > 0 && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 shadow-lg">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, discipline, or institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200/60 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-lg"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between mb-4">
                {/* <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${showFilters ? 'bg-blue-500' : 'bg-gray-400'}`} />
                </button> */}

                {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>AI-powered matching coming soon</span>
                </div> */}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200/60">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discipline
                    </label>
                    <select
                      value={selectedDiscipline}
                      onChange={(e) => setSelectedDiscipline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200/60 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white"
                    >
                      {disciplines.map((discipline) => (
                        <option key={discipline} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Level
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200/60 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        ${priceRange[0]}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedDiscipline("");
                        setSelectedLevel("");
                        setPriceRange([0, 200]);
                      }}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                onClick={() => handleMentorClick(mentor.id)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={mentor.image || "/images/default-mentor.jpg"}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-mentor.jpg";
                        }}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          mentor.availability === "Available"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {mentor.name}
                        </h3>
                        {!mentor.hasCompleteProfile && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                            Profile in progress
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {mentor.researchArea}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {mentor.institutionName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise && mentor.expertise.length > 0 ? (
                        <>
                          {mentor.expertise.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {mentor.expertise.length > 3 && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                              +{mentor.expertise.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                          Profile in progress
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Important Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium text-gray-900">
                        {mentor.hasCompleteProfile
                          ? `${mentor.completedProjects} projects`
                          : "Profile in progress"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium text-gray-900">
                        {mentor.hasCompleteProfile
                          ? mentor.responseTime
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Availability</span>
                      <span
                        className={`font-medium ${
                          mentor.hasCompleteProfile
                            ? mentor.availability === "Available"
                              ? "text-emerald-600"
                              : "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {mentor.hasCompleteProfile
                          ? mentor.availability
                          : "Profile in progress"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (mentor.hasCompleteProfile) {
                        handleMessageClick(mentor.id);
                      } else {
                        // For mentors with incomplete profiles, still allow viewing their basic info
                        handleMentorClick(mentor.id);
                      }
                    }}
                    className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      mentor.hasCompleteProfile
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white"
                    }`}
                  >
                    {mentor.hasCompleteProfile ? "Reach Out" : "View Profile"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMentors.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No mentors found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiscipline("");
                setSelectedLevel("");
                setPriceRange([0, 200]);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
