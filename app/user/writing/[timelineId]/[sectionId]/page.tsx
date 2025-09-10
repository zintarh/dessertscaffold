"use client";

import { useParams, useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import {
  timelinesAtom,
  updateSectionContentAtom,
  updateSectionStatusAtom,
  updateSectionCompletionAtom,
  fetchTimelinesAtom,
} from "../../../../../lib/stores/timelineStore";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react"; 
import { Timeline, TimelineSection } from "@/types";
import {
  ArrowLeft,
  Download,
  Save,
  PanelLeft,
  PanelLeftClose,
  MessageCircle,
  UserPlus,
  Copy,
  CheckCircle,
} from "lucide-react";
import ResearchSidebar from "../../../../components/ResearchSidebar";
import WritingChat from "../../../../components/WritingChat";
import Modal, { ModalFooter } from "../../../../components/Modal";
import toast from "react-hot-toast";
import NewTiptapEditor from "../../../../components/NewTiptapEditor";

export default function WritingSpacePage() {
  const params = useParams();
  const router = useRouter();
  const timelineId = params.timelineId as string;
  const sectionId = params.sectionId as string;
  const { data: session } = useSession();

  const timelines = useAtomValue(timelinesAtom);
  const updateSectionContent = useSetAtom(updateSectionContentAtom);
  const updateSectionStatus = useSetAtom(updateSectionStatusAtom);
  const updateSectionCompletion = useSetAtom(updateSectionCompletionAtom);
  const fetchTimelines = useSetAtom(fetchTimelinesAtom);

  // State for data fetching
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [section, setSection] = useState<TimelineSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Ref to track auto-save status without causing re-renders
  const autoSaveStatusRef = useRef<"idle" | "saving" | "saved" | "error">("idle");
  const lastSavedContentRef = useRef<string>("");
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingToggles = useRef<Set<string>>(new Set());

  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // Invite mentor state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Silent auto-save function - no UI updates, no re-renders
  const autoSaveContentSilent = useCallback(async (content: string) => {
    if (!content.trim() || autoSaveStatusRef.current === "saving") return;
    
    // Prevent saving the same content twice
    if (content === lastSavedContentRef.current) return;
    
    autoSaveStatusRef.current = "saving";
    
    try {
      const response = await fetch(`/api/timeline-sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        autoSaveStatusRef.current = "saved";
        lastSavedContentRef.current = content;
        // Only log success in development
        if (process.env.NODE_ENV === 'development') {
          console.log("✅ Auto-save successful");
        }
        } else {
        autoSaveStatusRef.current = "error";
        console.error("Auto-save failed:", response.status);
        // Show subtle error toast only on failure
        toast.error("Auto-save failed", { duration: 2000 });
      }
    } catch (error) {
      autoSaveStatusRef.current = "error";
      console.error("Auto-save error:", error);
      // Show subtle error toast only on failure
      toast.error("Auto-save failed", { duration: 2000 });
    }
    
    // Reset status after a short delay
    setTimeout(() => {
      autoSaveStatusRef.current = "idle";
    }, 1000);
  }, [sectionId]);

  // Manual save function - with UI feedback
  const autoSaveContent = useCallback(async (content: string) => {
    if (!content.trim()) return;

    console.log(
      "Auto-saving content for section:",
      sectionId,
      "Content length:",
      content.length
    );
    setSaveStatus("saving");
    try {
      const response = await fetch(`/api/timeline-sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      console.log("Auto-save response status:", response.status);

      if (response.ok) {
        const savedData = await response.json();
        console.log("Auto-save successful, saved data:", savedData);
        setSaveStatus("saved");
        // Update local store as well
        updateSectionContent(timelineId, sectionId, content);
        lastSavedContentRef.current = content;

        // Reset to idle after showing saved status
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        const errorData = await response.json();
        console.error("Auto-save failed:", errorData);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [sectionId, timelineId, updateSectionContent]);

  // Handle save function
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Save current section content
      await autoSaveContent(editorContent);
      
      // Update the last saved content ref
      lastSavedContentRef.current = editorContent;

      // Show success notification
      toast.success("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [autoSaveContent, editorContent]);

  // Handle editor change
  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
    // Reset save status when content changes (only for manual save status)
    if (saveStatus === "saved") {
      setSaveStatus("idle");
    }
  }, [saveStatus]);

  // Handle section click
  const handleSectionClick = useCallback((newSectionId: string) => {
    router.push(`/user/writing/${timelineId}/${newSectionId}`);
  }, [router, timelineId]);

  // Handle toggle section completion (new approach using isCompleted field)
  const handleToggleCompletion = useCallback(async (
    sectionId: string,
    currentCompleted: boolean
  ) => {
    // Prevent rapid toggling by checking if there's already a request in progress
    const toggleKey = `toggle-${sectionId}`;
    if (pendingToggles.current.has(toggleKey)) {
      return; // Ignore if already toggling this section
    }

    const newCompletedState = !currentCompleted;
    
    // Mark this section as being toggled
    pendingToggles.current.add(toggleKey);
    
    // Optimistic update - update global store immediately
    updateSectionCompletion(timelineId, sectionId, newCompletedState);
    
    // Update local state immediately for UI responsiveness
    setTimeline((prevTimeline) => {
      if (!prevTimeline) return prevTimeline;
      
      return {
        ...prevTimeline,
        sections: prevTimeline.sections.map((section) =>
          section.id === sectionId
            ? { ...section, isCompleted: newCompletedState }
            : section
        ),
      };
    });

    // Also update the current section if it's the one being toggled
    if (section && section.id === sectionId) {
      setSection((prevSection) => 
        prevSection ? { ...prevSection, isCompleted: newCompletedState } : prevSection
      );
    }

    try {
      const response = await fetch(`/api/timeline-sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: newCompletedState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update section completion");
      }

      toast.success(
        newCompletedState ? "Section marked as completed" : "Section marked as incomplete"
      );
    } catch (error) {
      console.error("Error updating section completion:", error);
      
      // Revert optimistic update on error
      updateSectionCompletion(timelineId, sectionId, currentCompleted);
      
      setTimeline((prevTimeline) => {
        if (!prevTimeline) return prevTimeline;
        
        return {
          ...prevTimeline,
          sections: prevTimeline.sections.map((section) =>
            section.id === sectionId
              ? { ...section, isCompleted: currentCompleted }
              : section
          ),
        };
      });

      if (section && section.id === sectionId) {
        setSection((prevSection) => 
          prevSection ? { ...prevSection, isCompleted: currentCompleted } : prevSection
        );
      }
      
      toast.error("Failed to update section completion");
    } finally {
      // Remove from pending toggles
      pendingToggles.current.delete(toggleKey);
    }
  }, [section, timelineId, updateSectionCompletion]);

  // Handle toggle section status (backward compatibility)
  const handleToggleSectionStatus = useCallback(async (
    sectionId: string,
    currentStatus: string
  ) => {
    try {
      // This function is used by the sidebar, but we're now using isCompleted
      // instead of status. We'll keep this for backward compatibility
      const newStatus =
        currentStatus === "completed" ? "not-started" : "completed";
      updateSectionStatus(timelineId, sectionId, newStatus);
    } catch (error) {
      console.error("Error updating section status:", error);
    }
  }, [timelineId, updateSectionStatus]);

  // Export section function
  const exportSection = useCallback(async () => {
    setIsExporting(true);

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Could not open print window");
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${section?.title} - ${timeline?.documentType}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 { 
              margin: 0 0 10px 0; 
              font-size: 24px;
              font-weight: bold;
            }
            .header h2 { 
              margin: 0; 
              font-size: 18px;
              font-weight: normal;
              color: #666;
            }
            .metadata {
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #007bff;
            }
            .metadata p {
              margin: 5px 0;
              font-size: 14px;
            }
            .content {
              margin-top: 30px;
            }
            .content h1, .content h2, .content h3 {
              color: #333;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .content p {
              margin-bottom: 15px;
            }
            .content ul, .content ol {
              margin-bottom: 15px;
              padding-left: 30px;
            }
            .content li {
              margin-bottom: 5px;
            }
            .content blockquote {
              margin: 20px 0;
              padding: 15px 20px;
              background: #f8f9fa;
              border-left: 4px solid #007bff;
              font-style: italic;
            }
            .content code {
              background: #f1f3f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            .content pre {
              background: #f1f3f4;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              margin: 15px 0;
            }
            .content pre code {
              background: none;
              padding: 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${section?.title}</h1>
            <h2>${timeline?.documentType} - ${timeline?.researchTopic}</h2>
          </div>
          
          <div class="metadata">
            <p><strong>Document Type:</strong> ${timeline?.documentType}</p>
            <p><strong>Research Topic:</strong> ${timeline?.researchTopic}</p>
            <p><strong>Academic Level:</strong> ${timeline?.academicLevel}</p>
            <p><strong>Discipline:</strong> ${timeline?.discipline}</p>
            <p><strong>Status:</strong> ${section?.isCompleted ? "Completed" : "Not Started"}</p>
            <p><strong>Exported:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            ${editorContent || '<p><em>No content available</em></p>'}
          </div>
          
          <div class="footer">
            <p>Generated by Dissertation Scaffold - ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
        printWindow.print();
        printWindow.close();

      toast.success("Section exported successfully!");
    } catch (error) {
      console.error("Error exporting section:", error);
      toast.error("Failed to export section");
    } finally {
      setIsExporting(false);
    }
  }, [section, timeline, editorContent]);

  // Export section content function
  const exportSectionContent = useCallback(async (exportData: any) => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Could not open print window");
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${exportData.title} - ${exportData.timeline.documentType}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 { 
              margin: 0 0 10px 0; 
              font-size: 24px;
              font-weight: bold;
            }
            .header h2 { 
              margin: 0; 
              font-size: 18px;
              font-weight: normal;
              color: #666;
            }
            .metadata {
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #007bff;
            }
            .metadata p {
              margin: 5px 0;
              font-size: 14px;
            }
            .content {
              text-align: justify;
              font-size: 12px;
            }
            .content h1, .content h2, .content h3 {
              color: #333;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .content p {
              margin-bottom: 12px;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${exportData.title}</h1>
            <h2>${exportData.timeline.documentType}</h2>
            ${exportData.timeline.researchTopic ? `<h3>${exportData.timeline.researchTopic}</h3>` : ""}
          </div>
          
          <div class="metadata">
            <p><strong>Academic Level:</strong> ${exportData.timeline.academicLevel}</p>
            <p><strong>Discipline:</strong> ${exportData.timeline.discipline}</p>
            <p><strong>Section Duration:</strong> ${exportData.section.duration} weeks</p>
            <p><strong>Status:</strong> ${exportData.section.isCompleted ? "Completed" : "Not Started"}</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            ${exportData.content || "<p><em>No content written yet.</em></p>"}
          </div>
          
          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
              Print/Save as PDF
            </button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Error exporting section content:", error);
      toast.error("Failed to export section. Please try again.");
    }
  }, []);

  // Invite mentor function
  const handleInviteMentor = useCallback(async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    setIsSubmittingInvite(true);
    try {
      const response = await fetch("/api/invite-codes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: inviteCode.trim(),
          timelineId: timelineId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Successfully invited ${data.mentor.name} to your writing space!`
        );
        setIsInviteModalOpen(false);
        setInviteCode("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to use invite code");
      }
    } catch (error) {
      console.error("Error using invite code:", error);
      toast.error("Failed to use invite code");
    } finally {
      setIsSubmittingInvite(false);
    }
  }, [inviteCode, timelineId]);
  

  // Set mounted state on client side
  useEffect(() => {
    setIsMounted(true);
    
    // Cleanup function to clear timeouts on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Fetch timeline and section data
  useEffect(() => {
    const fetchData = async () => {
      if (!timelineId || !sectionId) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log("🔍 Fetching timeline data for:", timelineId);

        // First try to get from the store (if already loaded)
        const storeTimeline = timelines.find((t) => t.id === timelineId);
        if (storeTimeline) {
          console.log("✅ Found timeline in store");
          const storeSection = storeTimeline.sections.find(
            (s) => s.id === sectionId
          );
          if (storeSection) {
            console.log("✅ Found section in store");
            setTimeline(storeTimeline);
            setSection(storeSection);
            setIsLoading(false);
            return;
          }
        }

        // If not in store, fetch from API
        console.log("📡 Fetching timeline from API");
        const response = await fetch(
          `/api/timelines/${timelineId}/sections/${sectionId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Section not found");
          } else {
            setError("Failed to load section data");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.success && data.data) {
          console.log("✅ Fetched section from API:", data.data);

          // We need to get the full timeline data to set the timeline state
          // Let's fetch the timeline separately
          const timelineResponse = await fetch("/api/timelines");
          if (timelineResponse.ok) {
            const timelineData = await timelineResponse.json();
            if (timelineData.success) {
              const fullTimeline = timelineData.timelines.find(
                (t: any) => t.id === timelineId
              );
              if (fullTimeline) {
                setTimeline(fullTimeline);
                setSection(data.data);
                setIsLoading(false);
                return;
              }
            }
          }

          setError("Timeline not found");
        } else {
          setError("Failed to load section data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timelineId, sectionId, timelines]);

  // Load section content from database
  useEffect(() => {
    const loadSectionContent = async () => {
      if (!isMounted || !sectionId || !section || isLoading) {
        return;
      }

      try {
        console.log("Loading content for section:", sectionId);

        // If section already has content, use it directly
        if (section.content && section.content.trim() !== '') {
          console.log("Using existing section content");
          setEditorContent(section.content);
          lastSavedContentRef.current = section.content;
          return;
        }

        // Otherwise, fetch the specific section content from API
        const response = await fetch(`/api/timeline-sections/${sectionId}`);
        
        if (response.ok) {
          const data = await response.json();
          const content = data.content || '';
          
          console.log("Fetched section content:", content ? 'Content found' : 'Empty content');
          setEditorContent(content);
          lastSavedContentRef.current = content;
        } else {
          console.log("No existing content, starting with empty editor");
          setEditorContent('');
          lastSavedContentRef.current = '';
        }
      } catch (error) {
        console.error("Error loading section content:", error);
        setEditorContent('');
        lastSavedContentRef.current = '';
      }
    };

    // Add a small delay to ensure the editor is ready
    const timeoutId = setTimeout(loadSectionContent, 100);
    return () => clearTimeout(timeoutId);
  }, [isMounted, sectionId, section, isLoading]);

    // Optimized auto-save with debounce - no re-renders
  useEffect(() => {
    // Don't auto-save if:
    // 1. No content or section
    // 2. Content hasn't changed from last saved
    // 3. Still loading initial content
    // 4. Content is empty (likely initial state)
    if (!editorContent || 
        !section || 
        editorContent === lastSavedContentRef.current ||
        isLoading ||
        editorContent.trim() === '' ||
        editorContent === '<p></p>') {
      return;
    }
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(async () => {
      await autoSaveContentSilent(editorContent);
    }, 2000); // 2 second debounce for better UX
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, section, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle sidebar visibility (Ctrl/Cmd + B)
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        setIsSidebarVisible(!isSidebarVisible);
      }
      
      // Save content (Ctrl/Cmd + S)
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarVisible, isChatVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        if (isChatVisible) {
          setIsChatVisible(false);
        } else {
          setIsChatVisible(true);
          setIsSidebarVisible(false); 
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarVisible, isChatVisible]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Writing Space
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we load your section...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !timeline || !section) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Section Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error === "Section not found"
                ? "The section you're looking for doesn't exist or you don't have access to it."
                : error === "Timeline not found"
                ? "The timeline you're looking for doesn't exist or you don't have access to it."
                : "Something went wrong while loading your writing space."}
            </p>
            <div className="flex justify-center space-x-4">
            <button
                onClick={() => router.push("/user/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Try Again
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }











  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
                onClick={() => router.push("/user/dashboard")}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Writing Space
              </h1>
              <p className="text-sm text-gray-600">
                {timeline.researchTopic} • {timeline.documentType}
              </p>
        </div>
      </div>

            {/* Toggle Buttons */}
            <div className="flex items-center space-x-2">
              {/* Chat Toggle Button */}
              <button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className={`p-2 transition-colors rounded-lg ${
                  isChatVisible 
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                title={
                  isChatVisible ? "Hide chat (Ctrl+M)" : "Show chat (Ctrl+M)"
                }
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              
                          <button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className={`p-2 transition-colors rounded-lg ${
                  isSidebarVisible 
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                title={
                  isSidebarVisible
                    ? "Hide sidebar (Ctrl+B)"
                    : "Show sidebar (Ctrl+B)"
                }
              >
                {isSidebarVisible ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                            )}
                          </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`grid grid-cols-1 gap-6 ${
            isSidebarVisible
              ? "xl:grid-cols-5"
              : "xl:grid-cols-1"
          }`}
        >
          {/* Research Sidebar */}
          {isSidebarVisible && (
            <div className="h-[calc(100vh-12rem)]">
            <ResearchSidebar
              timeline={timelines.find(t => t.id === timelineId) || timeline}
              currentSectionId={sectionId}
              onSectionClick={handleSectionClick}
              onToggleCompletion={handleToggleCompletion}
              onExportSection={(sectionItem) => {
                const currentTimeline = timelines.find(t => t.id === timelineId) || timeline;
                              const sectionContent = sectionItem.content || "";
                              const exportData = {
                                title: sectionItem.title,
                                content: sectionContent,
                  timeline: currentTimeline,
                                section: sectionItem,
                              };
                              exportSectionContent(exportData);
              } }
              isVisible={isSidebarVisible}
              onToggleVisibility={() => setIsSidebarVisible(!isSidebarVisible)}
              wordCount={0}
              onMarkComplete={() => { } }
              showCompletionButton={false} onToggleSectionStatus={function (sectionId: string, currentStatus: "not-started" | "in-progress" | "completed"): void {
                throw new Error("Function not implemented.");
              } }            />
            </div>
          )}

          {/* Main Writing Area */}
          <div
            className={
              isSidebarVisible
                ? "xl:col-span-4"
                : "xl:col-span-1"
            }
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Writing Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 truncate" title={section.title}>
                      Writing: {section.title}
                    </h2>
                    <p className="text-gray-600 mt-1 truncate" title={`${timeline.researchTopic} • ${timeline.documentType}`}>
                      {timeline.researchTopic} • {timeline.documentType}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </button>

                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Invite Mentor</span>
                    </button>
                    <button
                      onClick={exportSection}
                      disabled={isExporting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? "Exporting..." : "Export"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Target</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {timeline.sections.length * 200}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Current</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {timeline.sections.reduce((total, section) => {
                        if (section.content) {
                            return (
                              total +
                              section.content
                                .split(/\s+/)
                                .filter((word) => word.length > 0).length
                            );
                        }
                        return total;
                        }, 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Progress</div>
                      <div className="text-sm font-semibold text-blue-600">
                        {Math.round(
                          (timeline.sections.reduce((total, section) => {
                          if (section.content) {
                              return (
                                total +
                                section.content
                                  .split(/\s+/)
                                  .filter((word) => word.length > 0).length
                              );
                          }
                          return total;
                          }, 0) /
                            (timeline.sections.length * 200)) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (timeline.sections.reduce((total, section) => {
                              if (section.content) {
                                return (
                                  total +
                                  section.content
                                    .split(/\s+/)
                                    .filter((word) => word.length > 0).length
                                );
                              }
                              return total;
                            }, 0) /
                              (timeline.sections.length * 200)) *
                              100
                          )}%`,
                        }}
                      />
                  </div>
                </div>
              </div>

                {/* New Tiptap Editor */}
              <div className="p-6">
                  {isMounted ? (
                    <NewTiptapEditor
                      content={editorContent}
                      onChange={handleEditorChange}
                      placeholder={`Start writing your ${
                        section?.title?.toLowerCase() || "section"
                      }...`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p>Loading editor...</p>
                    </div>
                  </div>
                )}

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 mt-6 rounded-b-lg">
                <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                  <span>
                          Content auto-saves as you type • Press Ctrl+S to
                          manually save
                  </span>
                        {/* Save Status Indicator */}
                        <div className="flex items-center space-x-1">
                          {saveStatus === "saving" && (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              <span className="text-blue-600 text-xs">
                                Saving...
                              </span>
                            </>
                          )}
                          {saveStatus === "saved" && (
                            <>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 text-xs">
                                Saved
                              </span>
                            </>
                          )}
                          {saveStatus === "error" && (
                            <>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-red-600 text-xs">
                                Error saving
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                  <span className="font-medium">
                        {editorContent
                          ? editorContent
                              .replace(/<[^>]*>/g, "")
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      : 0}{" "}
                        words
                  </span>
                    </div>
                </div>
              </div>
            </div>
          </div>


          </div>
        </div>
      </div>

      {/* Invite Mentor Modal */}
      <Modal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        title="Invite Mentor to Writing Space"
        description="Enter the invite code provided by your mentor to grant them access to this writing space"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter mentor's invite code (e.g., ABC12345)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-mono text-lg tracking-wider"
              maxLength={8}
            />
            <p className="text-sm text-gray-500 mt-2">
              Ask your mentor for their unique invite code to grant them access
              to this writing space.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  What happens when you invite a mentor?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Mentor gets read access to your writing space</li>
                  <li>• They can view all sections and provide feedback</li>
                  <li>• You can collaborate on your research together</li>
                  <li>• You can revoke access anytime from settings</li>
                </ul>
              </div>
            </div>
          </div>

          <ModalFooter>
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleInviteMentor}
              disabled={!inviteCode.trim() || isSubmittingInvite}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              {isSubmittingInvite ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Inviting...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Mentor</span>
                </>
              )}
            </button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Writing Chat Modal */}
      <Modal
        open={isChatVisible}
        onOpenChange={setIsChatVisible}
        title="Writing Comments"
        description="Discuss your research with mentors and collaborators"
        size="2xl"
      >
        <div className="h-[700px]">
            <WritingChat
            isVisible={true}
            onToggleVisibility={() => setIsChatVisible(false)}
              timelineId={timelineId}
              sectionId={sectionId}
              currentUser={{
                id: session?.user?.id || "",
                name: session?.user?.name || "Unknown User",
                role: (session?.user as any)?.userType?.toLowerCase() || "student",
              }}
            />
        </div>
      </Modal>
    </div>
  );
}