#!/usr/bin/env python3
"""
Test script to verify the backend setup
Run this to check if everything is working correctly
"""

import sys
import os
import requests
import json

def test_backend():
    """Test if the backend is running and responding"""
    try:
        # Test basic endpoint
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and responding")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend at http://localhost:8000")
        print("   Make sure the backend is running")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False
    
    try:
        # Test health endpoint
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check endpoint working")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    try:
        # Test API docs
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API documentation accessible")
        else:
            print(f"❌ API docs failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ API docs error: {e}")
    
    return True

def test_frontend():
    """Test if the frontend is running and responding"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running and responding")
        else:
            print(f"❌ Frontend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to frontend at http://localhost:3000")
        print("   Make sure the frontend is running")
        return False
    except Exception as e:
        print(f"❌ Error testing frontend: {e}")
        return False
    
    return True

def main():
    print("🚀 Testing AI-Assisted Collaborative Diagramming Tool Setup")
    print("=" * 60)
    
    backend_ok = test_backend()
    print()
    
    frontend_ok = test_frontend()
    print()
    
    if backend_ok and frontend_ok:
        print("🎉 All tests passed! Your application is running correctly.")
        print()
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend API: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
        print()
        print("Next steps:")
        print("1. Open http://localhost:3000 in your browser")
        print("2. Create an account or sign in")
        print("3. Start creating diagrams!")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print()
        print("Troubleshooting tips:")
        print("1. Make sure Docker is running")
        print("2. Check if ports 3000 and 8000 are available")
        print("3. Run 'docker-compose logs' to see detailed error messages")
        print("4. Try restarting with 'docker-compose down && docker-compose up -d'")

if __name__ == "__main__":
    main()

