"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentSidebar from "./components/StudentSidebar";
import StudentNavbar from "./components/StudentNavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Sidebar */}
        <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Navbar */}
          <StudentNavbar onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
