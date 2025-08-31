import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save, 
  Download, 
  Share2, 
  Users, 
  Settings, 
  Undo, 
  Redo, 
  Trash2,
  Square,
  Circle,
  Type,
  ArrowRight,
  Zap
} from 'lucide-react';

const Canvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showCollaborators, setShowCollaborators] = useState(false);

  // Mock collaborators data
  useEffect(() => {
    setCollaborators([
      { id: 1, username: 'john_doe', color: '#3B82F6', online: true },
      { id: 2, username: 'jane_smith', color: '#10B981', online: true },
      { id: 3, username: 'bob_wilson', color: '#F59E0B', online: false }
    ]);
  }, []);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      // Initialize basic canvas (you'll integrate Fabric.js here later)
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Add grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= canvasRef.current.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasRef.current.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= canvasRef.current.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasRef.current.width, y);
        ctx.stroke();
      }
    }
  }, [canvas]);

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving diagram...');
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading diagram...');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing diagram...');
  };

  const handleAIClean = () => {
    // Implement AI cleaning functionality
    console.log('AI cleaning diagram...');
  };

  const tools = [
    { id: 'select', icon: '👆', label: 'Select' },
    { id: 'draw', icon: '✏️', label: 'Draw' },
    { id: 'rectangle', icon: '⬜', label: 'Rectangle' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'arrow', icon: '➡️', label: 'Arrow' },
    { id: 'line', icon: '➖', label: 'Line' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <h1 className="text-lg font-semibold text-gray-900">
              {id === 'new' ? 'New Diagram' : `Diagram ${id}`}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAIClean}
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Zap className="mr-2" size={16} />
              AI Clean
            </button>
            
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="mr-2" size={16} />
              Save
            </button>
            
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="mr-2" size={16} />
              Export
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="mr-2" size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={tool.label}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-xs mt-1">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Undo size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Redo size={16} />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors"
                >
                  <Users className="mr-1" size={14} />
                  {collaborators.filter(c => c.online).length} online
                </button>
                
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-white overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="border border-gray-300 shadow-lg cursor-crosshair"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties & Collaborators */}
        <div className="w-64 bg-white border-l border-gray-200">
          {showCollaborators ? (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${collaborator.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{collaborator.username}</p>
                      <p className="text-xs text-gray-500">
                        {collaborator.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fill Color
                  </label>
                  <input type="color" className="w-full h-10 rounded border border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Color
                  </label>
                  <input type="color" className="w-full h-10 rounded border border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Width
                  </label>
                  <input type="range" min="1" max="20" className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
