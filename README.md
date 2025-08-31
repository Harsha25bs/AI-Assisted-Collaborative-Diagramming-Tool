# AI-Assisted Collaborative Diagramming Tool

## Overview
This project is an enterprise-level, real-time web-based whiteboard for collaborative diagramming, featuring an AI assistant to clean up and align drawings. It is designed for teams to brainstorm visually and collaboratively, with AI-powered formatting and alignment.

## 🚀 Features

### Core Functionality
- **Real-time Collaborative Canvas**: Multiple users can draw simultaneously
- **AI-Powered Diagram Cleaning**: Automatic alignment and formatting using AI
- **User Authentication**: Secure JWT-based authentication system
- **Diagram Storage**: Save and retrieve diagrams with versioning
- **Real-time Presence**: See who's currently working on diagrams

### Technical Features
- **WebSocket Communication**: Real-time updates and collaboration
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS
- **Scalable Architecture**: Microservices-ready backend structure

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database for data persistence
- **Redis**: Message queuing and caching
- **WebSockets**: Real-time communication
- **JWT Authentication**: Secure user authentication

### Frontend (React)
- **React 18**: Modern React with hooks and context
- **Fabric.js**: Canvas drawing library
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing

## 🛠️ Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-assisted-collaborative-diagramming-tool
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development Setup

#### Backend Setup
1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up database**
   ```bash
   # Start PostgreSQL and Redis (or use Docker)
   docker-compose up postgres redis -d
   ```

4. **Run migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration and database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── main.py             # Application entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── db/                     # Database scripts
├── docker/                 # Docker configurations
├── docker-compose.yml      # Full stack orchestration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/diagramming_tool
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=8a52c334d2bec68e7866568477528270
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# AI Service
AI_API_KEY=your-ai-api-key
AI_SERVICE_URL=https://api.openai.com/v1
```

## 🚀 Development Roadmap

### Phase 1: Foundation (Week 1-2) ✅
- [x] Backend project structure
- [x] Database models and authentication
- [x] Basic API endpoints
- [x] Frontend project structure
- [x] Authentication system

### Phase 2: Real-time Collaboration (Week 3-4)
- [ ] WebSocket implementation
- [ ] Real-time drawing synchronization
- [ ] User presence tracking
- [ ] Conflict resolution

### Phase 3: AI Integration (Week 5-6)
- [ ] AI service integration
- [ ] Diagram interpretation
- [ ] Auto-alignment algorithms
- [ ] Smart shape recognition

### Phase 4: Production Readiness (Week 7-8)
- [ ] Testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- FastAPI team for the excellent web framework
- React team for the amazing frontend library
- Fabric.js team for the canvas drawing capabilities
- Tailwind CSS team for the utility-first CSS framework
