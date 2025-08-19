'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  FileText, 
  User,
  Calendar,
  Eye,
  Download,
  Star
} from 'lucide-react';

interface SharedDocument {
  id: number;
  title: string;
  content: string;
  type: 'research' | 'proposal' | 'paper' | 'review';
  status: 'pending' | 'approved' | 'revision' | 'completed';
  lastModified: string;
  sharedBy: string;
  sharedDate: string;
  permissions: 'view' | 'comment' | 'edit';
  isStarred: boolean;
}

const mockSharedDocuments: SharedDocument[] = [
  {
    id: 1,
    title: 'My Research Proposal Draft',
    content: 'This is my research proposal for the AI ethics study. I\'ve outlined the methodology, expected outcomes, and timeline for the project...',
    type: 'proposal',
    status: 'pending',
    lastModified: '2 hours ago',
    sharedBy: 'Dr. Sarah Chen',
    sharedDate: '2024-01-15',
    permissions: 'comment',
    isStarred: false
  },
  {
    id: 2,
    title: 'Literature Review Chapter',
    content: 'My literature review chapter covering recent developments in AI ethics research. I\'ve analyzed 25+ papers and identified key trends...',
    type: 'research',
    status: 'completed',
    lastModified: '1 day ago',
    sharedBy: 'Prof. Michael Rodriguez',
    sharedDate: '2024-01-14',
    permissions: 'view',
    isStarred: true
  },
  {
    id: 3,
    title: 'Methodology Section',
    content: 'Detailed methodology section for my research. I\'ve described the experimental design, participant recruitment, and data collection methods...',
    type: 'paper',
    status: 'approved',
    lastModified: '3 days ago',
    sharedBy: 'Dr. Aisha Patel',
    sharedDate: '2024-01-12',
    permissions: 'edit',
    isStarred: false
  },
  {
    id: 4,
    title: 'Data Analysis Results',
    content: 'Preliminary results from my data analysis. I\'ve included statistical tests, visualizations, and initial interpretations of the findings...',
    type: 'research',
    status: 'revision',
    lastModified: '1 week ago',
    sharedBy: 'Dr. Sarah Chen',
    sharedDate: '2024-01-08',
    permissions: 'comment',
    isStarred: true
  }
];

export default function SharedDocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [starredDocuments, setStarredDocuments] = useState<number[]>([]);

  const handleDocumentClick = (documentId: number) => {
    router.push(`/student/shared/${documentId}`);
  };

  const handleStarToggle = (documentId: number) => {
    setStarredDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const filteredDocuments = mockSharedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.sharedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         doc.status === selectedFilter ||
                         doc.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'revision': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return '🔬';
      case 'proposal': return '📋';
      case 'paper': return '📄';
      case 'review': return '✍️';
      default: return '📄';
    }
  };

  const getPermissionsIcon = (permissions: string) => {
    switch (permissions) {
      case 'view': return '👁️';
      case 'comment': return '💬';
      case 'edit': return '✏️';
      default: return '👁️';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shared with Mentors</h1>
              <p className="text-gray-600 mt-1">
                Documents you've shared with mentors and collaborators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shared documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="all">All Documents</option>
                <option value="research">Research</option>
                <option value="proposal">Proposal</option>
                <option value="paper">Paper</option>
                <option value="review">Review</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="revision">Revision</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shared documents found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Documents shared with you will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc.id)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                    <span className="text-sm font-medium text-gray-500 capitalize">{doc.type}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarToggle(doc.id);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      starredDocuments.includes(doc.id) 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${starredDocuments.includes(doc.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {doc.content}
                </p>

                {/* Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>Shared with {doc.sharedBy}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Shared {doc.sharedDate}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{getPermissionsIcon(doc.permissions)}</span>
                    <span className="capitalize">{doc.permissions} access</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentClick(doc.id);
                    }}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
