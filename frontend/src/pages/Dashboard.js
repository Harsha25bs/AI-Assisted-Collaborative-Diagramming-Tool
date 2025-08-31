import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Filter, Grid, List, Eye, Edit, Trash2, Users } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - replace with actual API call
  useEffect(() => {
    // Simulate loading diagrams
    setTimeout(() => {
      setDiagrams([
        {
          id: 1,
          title: 'Project Architecture',
          description: 'High-level system architecture diagram',
          created_at: '2024-01-15',
          updated_at: '2024-01-20',
          is_public: true,
          collaborators: 3
        },
        {
          id: 2,
          title: 'User Flow Diagram',
          description: 'Customer journey and user experience flow',
          created_at: '2024-01-10',
          updated_at: '2024-01-18',
          is_public: false,
          collaborators: 1
        },
        {
          id: 3,
          title: 'Database Schema',
          description: 'Database relationships and table structure',
          created_at: '2024-01-05',
          updated_at: '2024-01-15',
          is_public: true,
          collaborators: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDiagrams = diagrams.filter(diagram =>
    diagram.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagram.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your diagrams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {currentUser?.full_name || currentUser?.username}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your diagrams and collaborate with your team
              </p>
            </div>
            <Link
              to="/canvas/new"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2" size={20} />
              New Diagram
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search diagrams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Filter size={20} />
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diagrams Grid/List */}
        {filteredDiagrams.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No diagrams found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first diagram.'}
            </p>
            {!searchTerm && (
              <Link
                to="/canvas/new"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="mr-2" size={20} />
                Create Your First Diagram
              </Link>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-6' : 'p-6'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {diagram.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {diagram.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>Updated {diagram.updated_at}</span>
                      {diagram.is_public && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    {diagram.collaborators} collaborator{diagram.collaborators !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/canvas/${diagram.id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
