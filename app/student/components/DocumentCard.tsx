'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Menu, Share, Download, Star, Trash2, Edit, Copy, Eye } from 'lucide-react';

interface DocumentCardProps {
  id: number;
  title: string;
  content: string;
  type: 'checklist' | 'document' | 'research';
  status: 'draft' | 'in-progress' | 'completed';
  lastModified: string;
  onMenuClick?: () => void;
  onMoreClick?: () => void;
}

export default function DocumentCard({
  id,
  title,
  content,
  type,
  status,
  lastModified,
  onMenuClick,
  onMoreClick
}: DocumentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return '📋';
      case 'document':
        return '📄';
      case 'research':
        return '🔬';
      default:
        return '📄';
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    onMoreClick?.();
  };

  const handleAction = (action: string) => {
    console.log(`${action} clicked for: ${title}`);
    setIsMenuOpen(false);
    
    if (action === 'View') {
      router.push(`/student/documents/${id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative" ref={menuRef}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={onMenuClick}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Menu className="w-4 h-4 text-gray-600" />
        </button>
        
        <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 text-center px-2">
          {title}
        </h3>
        
        <button 
          onClick={handleMoreClick}
          className="p-1 hover:bg-gray-100 rounded transition-colors relative"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        {/* Document Type and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(type)}</span>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {type} Document
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {status.replace('-', ' ')}
          </span>
        </div>

        {/* Content Preview */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-3">
            {content}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Modified {lastModified}
          </p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-12 right-4 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={() => handleAction('View')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              <span>View</span>
            </button>
            
            <button
              onClick={() => handleAction('Edit')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-500" />
              <span>Edit</span>
            </button>
            
            <button
              onClick={() => handleAction('Share')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share className="w-4 h-4 text-gray-500" />
              <span>Share</span>
            </button>
            
            <button
              onClick={() => handleAction('Download')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Download</span>
            </button>
            
            <button
              onClick={() => handleAction('Copy')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              <span>Make a copy</span>
            </button>
            
            <button
              onClick={() => handleAction('Star')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Star className="w-4 h-4 text-gray-500" />
              <span>Add to starred</span>
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              onClick={() => handleAction('Delete')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Move to trash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
