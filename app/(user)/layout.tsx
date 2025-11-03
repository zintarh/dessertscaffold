"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardNavbar from "./components/DashboardNavbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div>
      <div className="min-h-screen bg-white">
        <DashboardSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-h-screen">{children}</main>
        </div>

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
