import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Users, Zap, Palette } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered
            <span className="text-primary-600 block">Collaborative</span>
            Diagramming
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create, collaborate, and perfect diagrams in real-time with the help of AI. 
            Work together seamlessly with your team to build beautiful, professional diagrams.
          </p>
          
          {currentUser ? (
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-primary-600"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Collaboration</h3>
            <p className="text-gray-600">
              Work together with your team in real-time. See who's online, track changes, and collaborate seamlessly.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Cleaning</h3>
            <p className="text-gray-600">
              Let AI automatically align, format, and improve your diagrams for professional results.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
            <p className="text-gray-600">
              Start with beautiful templates and customize them to match your brand and style.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Diagramming?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams already using our collaborative diagramming tool.
          </p>
          {!currentUser && (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Creating Today
              <ArrowRight className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

