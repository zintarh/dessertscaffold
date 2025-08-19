'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Grid, 
  List, 
  MoreHorizontal,
  Plus,
  Filter,
  SortAsc,
  Folder
} from 'lucide-react';
import DocumentCard from '../components/DocumentCard';

interface Document {
  id: number;
  title: string;
  content: string;
  type: 'checklist' | 'document' | 'research';
  status: 'draft' | 'in-progress' | 'completed';
  lastModified: string;
  size: string;
  author: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const documents: Document[] = [
    {
      id: 1,
      title: 'Mobility Logistics Checklist',
      content: 'Support + Group Coordination + Tour - Before the Event: Create a Telegram or WhatsApp group for all attendees, Share your contact information as the official logistics support lead, Pin key info in the group: venue location, check-in time, what to expect. Arrival Support: Coordinate airport pickups, Arrange transportation to venue, Provide welcome packets.',
      type: 'checklist',
      status: 'draft',
      lastModified: '2 hours ago',
      size: '2.4 KB',
      author: 'Alex Thompson'
    },
    {
      id: 2,
      title: 'AI Ethics Research Proposal',
      content: 'Comprehensive analysis of ethical considerations in artificial intelligence development and deployment. Covers bias mitigation, transparency, accountability, and societal impact assessment.',
      type: 'research',
      status: 'in-progress',
      lastModified: '1 day ago',
      size: '15.7 KB',
      author: 'Alex Thompson'
    },
    {
      id: 3,
      title: 'Machine Learning in Healthcare',
      content: 'Research paper exploring the applications of machine learning algorithms in medical diagnosis, treatment planning, and patient outcome prediction.',
      type: 'research',
      status: 'completed',
      lastModified: '3 days ago',
      size: '28.3 KB',
      author: 'Alex Thompson'
    },
    {
      id: 4,
      title: 'Research Methodology Notes',
      content: 'Detailed notes on research methodology including data collection methods, statistical analysis approaches, and validation techniques.',
      type: 'document',
      status: 'draft',
      lastModified: '1 week ago',
      size: '8.9 KB',
      author: 'Alex Thompson'
    },
    {
      id: 5,
      title: 'Mentor Meeting Summary',
      content: 'Summary of discussion with Dr. Chen regarding research progress, next steps, and feedback on current methodology.',
      type: 'document',
      status: 'completed',
      lastModified: '1 week ago',
      size: '5.2 KB',
      author: 'Alex Thompson'
    },
    {
      id: 6,
      title: 'Literature Review Draft',
      content: 'Comprehensive review of existing literature in the field of quantum computing applications and their potential impact on research.',
      type: 'research',
      status: 'in-progress',
      lastModified: '2 weeks ago',
      size: '42.1 KB',
      author: 'Alex Thompson'
    },
    {
      id: 7,
      title: 'Conference Presentation Slides',
      content: 'Slides for upcoming conference presentation on AI ethics in research methodology.',
      type: 'document',
      status: 'draft',
      lastModified: '3 weeks ago',
      size: '12.8 KB',
      author: 'Alex Thompson'
    },
    {
      id: 8,
      title: 'Data Analysis Results',
      content: 'Statistical analysis results from the healthcare machine learning study with visualizations and interpretations.',
      type: 'research',
      status: 'completed',
      lastModified: '1 month ago',
      size: '35.6 KB',
      author: 'Alex Thompson'
    }
  ];

  const folders = [
    { id: 1, name: 'Research Papers', items: 24, color: 'bg-blue-100' },
    { id: 2, name: 'Topic Evaluations', items: 18, color: 'bg-emerald-100' },
    { id: 3, name: 'Meeting Notes', items: 12, color: 'bg-orange-100' },
    { id: 4, name: 'Collaborations', items: 8, color: 'bg-purple-100' }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = (docId: number) => {
    console.log('Menu clicked for document:', docId);
  };

  const handleMoreClick = (docId: number) => {
    console.log('More options clicked for document:', docId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-gray-900">My Research</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your research documents and files</p>
          </div>
          
          <button 
            onClick={() => router.push('/student/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in My Research"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
           
           
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

       
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Folders Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Folders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <div key={folder.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center`}>
                      <Folder className="w-6 h-6 text-gray-600" />
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

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <p className="text-sm text-gray-500">{filteredDocuments.length} items</p>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    content={doc.content}
                    type={doc.type}
                    status={doc.status}
                    lastModified={doc.lastModified}
                    onMenuClick={() => handleMenuClick(doc.id)}
                    onMoreClick={() => handleMoreClick(doc.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Modified</div>
                    <div className="col-span-1">Size</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Folder className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.title}</p>
                              <p className="text-sm text-gray-500">{doc.author}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600 capitalize">{doc.type}</span>
                        </div>
                        <div className="col-span-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            doc.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                            doc.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {doc.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600">{doc.lastModified}</span>
                        </div>
                        <div className="col-span-1">
                          <span className="text-sm text-gray-600">{doc.size}</span>
                        </div>
                        <div className="col-span-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
