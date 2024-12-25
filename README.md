# 🚀 Project Management Tool

A modern, real-time project management application built with the MERN stack. Designed for teams who need powerful collaboration tools with a seamless user experience.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## ✨ Features

### Core Functionality
- **Real-time Updates**: Instant synchronization across all users using WebSocket technology
- **Kanban Board Interface**: Intuitive drag-and-drop task management
- **Team Collaboration**: Real-time team messaging and collaboration tools
- **Advanced Task Management**: 
  - Task prioritization
  - Due date tracking
  - File attachments
  - Custom labels and tags
  - Task dependencies

### User Experience
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Customizable Boards**: Personalize your workflow with custom columns and fields
- **Dark/Light Mode**: Support for different viewing preferences
- **Rich Text Editing**: Markdown support for task descriptions and comments

### Security & Administration
- **Role-based Access Control**: Granular permissions for different user roles
- **Audit Logging**: Track all changes and user actions
- **Data Export**: Export project data in multiple formats (CSV, JSON)

## 🛠️ Tech Stack

### Frontend Architecture
- **React.js 18**: Modern UI development with hooks and functional components
- **Redux Toolkit**: Efficient state management with built-in best practices
- **Material-UI v5**: Polished component library with customization options
- **Socket.io-client**: Real-time bi-directional event-based communication
- **React DnD**: Drag-and-drop functionality for task management
- **React Query**: Efficient data fetching and cache management

### Backend Infrastructure
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling
- **Socket.io**: WebSocket implementation for real-time features
- **JWT**: Secure authentication and authorization
- **Jest**: Unit and integration testing
- **Winston**: Logging framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v7 or higher) or yarn

### Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/Avijitdam98/Project_Managment_tool.git
cd Project_Managment_tool
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configurations
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Environment Configuration**

Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_uri

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Optional Configurations
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

5. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Support
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 Documentation

- [API Documentation](docs/api.md)
- [Frontend Documentation](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Avijit Dam**
- GitHub: [@Avijitdam98](https://github.com/Avijitdam98)
- LinkedIn: [Connect with me](https://linkedin.com/in/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the MERN stack community for their excellent documentation
- Material-UI team for their comprehensive component library

## 📞 Support

For support, email support@yourproject.com or join our Discord channel.

---
Built with ❤️ by Avijit Dam
