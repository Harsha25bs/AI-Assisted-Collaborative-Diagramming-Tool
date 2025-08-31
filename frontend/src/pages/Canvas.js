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
  const [selectedTool, setSelectedTool] = useState('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [startPoint, setStartPoint] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
      const canvasElement = canvasRef.current;
      const ctx = canvasElement.getContext('2d');
      
      // Set canvas size
      canvasElement.width = 1200;
      canvasElement.height = 800;
      
      // Initialize with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      
      // Add grid
      drawGrid(ctx);
      
      setCanvas(canvasElement);
      
      // Save initial state
      saveCanvasState();
    }
  }, [canvas]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= 1200; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= 800; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }
  };

  // Improved coordinate calculation function
  const getCanvasCoordinates = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get the scale factors between CSS pixels and canvas pixels
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate the mouse position relative to the canvas element
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Ensure coordinates are within canvas bounds
    return {
      x: Math.max(0, Math.min(x, canvas.width)),
      y: Math.max(0, Math.min(y, canvas.height))
    };
  };

  const saveCanvasState = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      const newHistory = drawingHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(imageData);
      setDrawingHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setStartPoint(coords);
    
    if (selectedTool === 'draw') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const coords = getCanvasCoordinates(e);
    setCursorPosition(coords);
    
    if (!isDrawing) return;
    
    if (selectedTool === 'draw') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool === 'draw') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      ctx.closePath();
    } else if (selectedTool === 'line' && startPoint) {
      drawLine(startPoint.x, startPoint.y, coords.x, coords.y);
    } else if (selectedTool === 'rectangle' && startPoint) {
      drawRectangle(startPoint.x, startPoint.y, coords.x, coords.y);
    } else if (selectedTool === 'circle' && startPoint) {
      drawCircle(startPoint.x, startPoint.y, coords.x, coords.y);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    saveCanvasState();
  };

  const drawLine = (x1, y1, x2, y2) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  const drawRectangle = (x1, y1, x2, y2) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const width = x2 - x1;
    const height = y2 - y1;
    
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(x1, y1, width, height);
  };

  const drawCircle = (x1, y1, x2, y2) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      loadCanvasState(drawingHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < drawingHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      loadCanvasState(drawingHistory[newIndex]);
    }
  };

  const loadCanvasState = (imageData) => {
    if (!canvasRef.current) return;
    
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      drawGrid(ctx);
    };
    img.src = imageData;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawGrid(ctx);
    saveCanvasState();
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving diagram...');
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `diagram-${id || 'new'}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
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
    { id: 'line', icon: '➖', label: 'Line' },
    { id: 'rectangle', icon: '⬜', label: 'Rectangle' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'arrow', icon: '➡️', label: 'Arrow' }
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
                <button 
                  onClick={handleUndo}
                  disabled={currentHistoryIndex <= 0}
                  className={`p-2 transition-colors ${
                    currentHistoryIndex <= 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Undo size={16} />
                </button>
                <button 
                  onClick={handleRedo}
                  disabled={currentHistoryIndex >= drawingHistory.length - 1}
                  className={`p-2 transition-colors ${
                    currentHistoryIndex >= drawingHistory.length - 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Redo size={16} />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button 
                  onClick={clearCanvas}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
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
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousedown', {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    handleMouseDown(mouseEvent);
                  }
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousemove', {
                      clientX: touch.clientX,
                      clientY: touch.clientY
                    });
                    handleMouseMove(mouseEvent);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (e.touches.length === 0) {
                    const mouseEvent = new MouseEvent('mouseup', {});
                    handleMouseUp(mouseEvent);
                  }
                }}
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
                    Drawing Color
                  </label>
                  <input 
                    type="color" 
                    value={drawingColor}
                    onChange={(e) => setDrawingColor(e.target.value)}
                    className="w-full h-10 rounded border border-gray-300" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Width: {strokeWidth}px
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-full" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Tool
                  </label>
                  <div className="text-sm text-gray-900 capitalize bg-gray-100 px-3 py-2 rounded">
                    {selectedTool}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cursor Position
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded">
                    X: {Math.round(cursorPosition.x)}, Y: {Math.round(cursorPosition.y)}
                  </div>
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
