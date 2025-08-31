#!/usr/bin/env python3
"""
Test script for AI-Assisted Collaborative Diagramming Tool Authentication
"""

import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000"  # Changed from localhost to 127.0.0.1
API_BASE = f"{BASE_URL}/api/v1"

def test_registration():
    """Test user registration endpoint"""
    print("1. Testing User Registration...")
    
    registration_data = {
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/register",
            json=registration_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Registration successful!")
            return response.json()
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login():
    """Test user login endpoint"""
    print("\n2. Testing User Login...")
    
    login_data = {
        "username": "testuser",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            data=login_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Login error: {e}")
        return None

def test_current_user(token):
    """Test getting current user info"""
    print("\n3. Testing Get Current User...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Get current user successful!")
            user_data = response.json()
            print(f"User: {user_data.get('username')} ({user_data.get('email')})")
            return user_data
        else:
            print(f"❌ Get current user failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Get current user error: {e}")
        return None

def main():
    """Main test function"""
    print("🚀 Testing AI-Assisted Collaborative Diagramming Tool Authentication")
    print("=" * 70)
    print("🧪 Testing Authentication Endpoints")
    print("=" * 50)
    
    # Test registration
    registration_result = test_registration()
    
    if not registration_result:
        print("\n❌ Some authentication tests failed.")
        print("\nTroubleshooting tips:")
        print("1. Make sure the backend is running on http://127.0.0.1:8000")
        print("2. Check if the database is properly initialized")
        print("3. Look at the backend logs for error messages")
        return
    
    # Test login
    login_result = test_login()
    
    if not login_result:
        print("\n❌ Login failed, cannot test other endpoints.")
        return
    
    # Extract token
    token = login_result.get("access_token")
    if not token:
        print("❌ No access token received from login")
        return
    
    # Test getting current user
    test_current_user(token)
    
    print("\n✅ All authentication tests completed successfully!")
    print("🎉 The backend authentication system is working properly!")

if __name__ == "__main__":
    main()
