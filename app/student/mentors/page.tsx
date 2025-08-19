"use client";

import { Users } from "lucide-react";

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentors</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This page is under development. Soon you'll be able to find and connect with research mentors here.
          </p>
        </div>
      </div>
    </div>
  );
}
