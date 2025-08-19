'use client';

import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Brain, 
  Plus,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Folder
} from 'lucide-react';
import DocumentCard from '../components/DocumentCard';

export default function StudentDashboard() {
  const router = useRouter();
  const folders = [
    { id: 1, name: 'Research Papers', type: 'folder', items: 24 },
    { id: 2, name: 'Topic Evaluations', type: 'folder', items: 18 },
    { id: 3, name: 'Meeting Notes', type: 'folder', items: 12 },
    { id: 4, name: 'Collaborations', type: 'folder', items: 8 }
  ];

  const files = [
    { 
      id: 1, 
      title: 'Mobility Logistics Checklist', 
      content: 'Support + Group Coordination + Tour - Before the Event: Create a Telegram or WhatsApp group for all attendees, Share your contact information as the official logistics support lead, Pin key info in the group: venue location, check-in time, what to expect. Arrival Support: Coordinate airport pickups, Arrange transportation to venue, Provide welcome packets.',
      type: 'checklist' as const,
      status: 'draft' as const,
      lastModified: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Expert Ethics Research Proposal', 
      content: 'Comprehensive analysis of ethical considerations in artificial intelligence development and deployment. Covers bias mitigation, transparency, accountability, and societal impact assessment.',
      type: 'research' as const,
      status: 'in-progress' as const,
      lastModified: '1 day ago'
    },
    { 
      id: 3, 
      title: 'Machine Learning in Healthcare', 
      content: 'Research paper exploring the applications of machine learning algorithms in medical diagnosis, treatment planning, and patient outcome prediction.',
      type: 'research' as const,
      status: 'completed' as const,
      lastModified: '3 days ago'
    },
    { 
      id: 4, 
      title: 'Research Methodology Notes', 
      content: 'Detailed notes on research methodology including data collection methods, statistical analysis approaches, and validation techniques.',
      type: 'document' as const,
      status: 'draft' as const,
      lastModified: '1 week ago'
    },
    { 
      id: 5, 
      title: 'Mentor Meeting Summary', 
      content: 'Summary of discussion with Dr. Chen regarding research progress, next steps, and feedback on current methodology.',
      type: 'document' as const,
      status: 'completed' as const,
      lastModified: '1 week ago'
    },
    { 
      id: 6, 
      title: 'Literature Review Draft', 
      content: 'Comprehensive review of existing literature in the field of quantum computing applications and their potential impact on research.',
      type: 'research' as const,
      status: 'in-progress' as const,
      lastModified: '2 weeks ago'
    }
  ];



  const handleMenuClick = (fileId: number) => {
    console.log('Menu clicked for file:', fileId);
  };

  const handleMoreClick = (fileId: number) => {
    console.log('More options clicked for file:', fileId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-900">My Research</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/student/new')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write</span>
            </button>
          
           
           
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in Research"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>


      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Folders Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div key={folder.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{folder.name}</h3>
                    <p className="text-sm text-gray-500">{folder.items} items</p>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Files Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <DocumentCard
                key={file.id}
                id={file.id}
                title={file.title}
                content={file.content}
                type={file.type}
                status={file.status}
                lastModified={file.lastModified}
                onMenuClick={() => handleMenuClick(file.id)}
                onMoreClick={() => handleMoreClick(file.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
