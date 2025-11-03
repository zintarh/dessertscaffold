"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/lib/stores/authStore";
import { Calendar, User, CheckCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

interface AcceptedProject {
  id: string;
  title: string;
  documentType: string;
  student: {
    name: string;
    email: string;
  };
  acceptedAt: string;
  status: string;
}

export default function AcceptedResearchProjects() {
  const user = useAtomValue(userAtom);
  const [projects, setProjects] = useState<AcceptedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    if (user?.userType === "MENTOR") {
      fetchAcceptedProjects();
    }
  }, [user]);

  const fetchAcceptedProjects = async () => {
    try {
      const response = await fetch("/api/mentor/accepted-projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching accepted projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.userType !== "MENTOR") {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accepted Research Projects</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Accepted Research Projects</h2>
        <span className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No accepted projects yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Projects you accept will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {project.documentType}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{project.student.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Accepted {new Date(project.acceptedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => router.push(`/timelines/${project.id}`)}
                  variant="primary"
                  size="sm"
                >
                  View Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}