'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  Share2, 
  Edit3,
  Calendar,
  Users,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Dummy documents data
const dummyDocuments = [
  {
    id: 1,
    title: "Machine Learning in Healthcare: A Comprehensive Review",
    status: "Under Review",
    mentors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
    lastUpdated: "2 hours ago",
    wordCount: 3247,
    progress: 75,
    type: "Research Paper",
    subject: "Computer Science",
    createdAt: "Dec 10, 2024"
  },
  {
    id: 2,
    title: "The Impact of Climate Change on Urban Biodiversity",
    status: "Draft",
    mentors: ["Dr. Emily Rodriguez"],
    lastUpdated: "1 day ago",
    wordCount: 1892,
    progress: 45,
    type: "Thesis",
    subject: "Environmental Science",
    createdAt: "Dec 8, 2024"
  },
  {
    id: 3,
    title: "Quantum Computing Applications in Cryptography",
    status: "Final",
    mentors: ["Dr. James Wilson", "Prof. Lisa Zhang"],
    lastUpdated: "3 days ago",
    wordCount: 4567,
    progress: 100,
    type: "Research Paper",
    subject: "Physics",
    createdAt: "Nov 25, 2024"
  },
  {
    id: 4,
    title: "Sustainable Energy Solutions for Developing Nations",
    status: "Draft",
    mentors: [],
    lastUpdated: "5 days ago",
    wordCount: 1234,
    progress: 30,
    type: "Research Proposal",
    subject: "Engineering",
    createdAt: "Dec 3, 2024"
  },
  {
    id: 5,
    title: "Neural Networks in Natural Language Processing",
    status: "Under Review",
    mentors: ["Dr. Robert Kim"],
    lastUpdated: "1 week ago",
    wordCount: 2987,
    progress: 85,
    type: "Research Paper",
    subject: "Computer Science",
    createdAt: "Nov 20, 2024"
  },
  {
    id: 6,
    title: "Economic Implications of Digital Currency Adoption",
    status: "Final",
    mentors: ["Prof. Amanda Foster"],
    lastUpdated: "2 weeks ago",
    wordCount: 5123,
    progress: 100,
    type: "Thesis",
    subject: "Economics",
    createdAt: "Oct 15, 2024"
  }
];

const statusColors = {
  'Draft': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Under Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Final': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
};

const statusIcons = {
  'Draft': Pause,
  'Under Review': Clock,
  'Final': CheckCircle
};

export default function DocumentsPage() {
  const { isDarkMode, isHydrated } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredDocuments = dummyDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || doc.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const uniqueSubjects = [...new Set(dummyDocuments.map(doc => doc.subject))];
  const uniqueStatuses = [...new Set(dummyDocuments.map(doc => doc.status))];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Documents Library</h1>
              <p className={`text-xl ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Manage and organize your research documents
              </p>
            </div>
            <Link
              href="/writing-environment"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Document</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dummyDocuments.length}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Documents</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dummyDocuments.filter(d => d.status === 'Final').length}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completed</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dummyDocuments.filter(d => d.status === 'Under Review').length}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>In Review</p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Pause className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dummyDocuments.filter(d => d.status === 'Draft').length}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Drafts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-white'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{doc.title}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                          {doc.status}
                        </span> */}
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {doc.type}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        doc.subject === 'Computer Science' ? 'bg-blue-500' :
                        doc.subject === 'Environmental Science' ? 'bg-green-500' :
                        doc.subject === 'Physics' ? 'bg-purple-500' :
                        doc.subject === 'Engineering' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {doc.subject}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {doc.wordCount.toLocaleString()} words
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {doc.lastUpdated}
                      </span>
                    </div>

                    {doc.mentors.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {doc.mentors.length} mentor{doc.mentors.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                      <span className="font-medium">{doc.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          doc.progress >= 80 ? 'bg-green-500' :
                          doc.progress >= 50 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${doc.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/writing/${doc.id}`}
                      className="flex-1 mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Open</span>
                    </Link>
                    
                    <div className="flex space-x-1">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`rounded-2xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Document</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Mentors</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {filteredDocuments.map((doc, index) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-sm">{doc.title}</div>
                            <div className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {doc.type} • {doc.wordCount.toLocaleString()} words
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                            {doc.status}
                          </span> */}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                            {doc.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            {doc.mentors.slice(0, 2).map((mentor, idx) => (
                              <div key={idx} className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white`}>
                                {mentor.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {doc.mentors.length > 2 && (
                              <span className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                +{doc.mentors.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {doc.lastUpdated}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  doc.progress >= 80 ? 'bg-green-500' :
                                  doc.progress >= 50 ? 'bg-blue-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${doc.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{doc.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/writing/${doc.id}`}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Open</span>
                            </Link>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No documents found</h3>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Link
              href="/writing-environment"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Document</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
