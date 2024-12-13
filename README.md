# Project Management Tool

A modern, real-time project management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Real-time updates using WebSocket
- Kanban board interface
- Task management with drag-and-drop functionality
- User authentication and authorization
- Team collaboration
- Board customization
- Task comments and notifications

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material-UI for components
- Socket.io-client for real-time updates

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time communication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Avijitdam98/Project_Managment_tool.git
cd Project_Managment_tool
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create .env file in backend directory with following variables
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development servers

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Avijit Dam - [GitHub](https://github.com/Avijitdam98)

Project Link: [https://github.com/Avijitdam98/Project_Managment_tool](https://github.com/Avijitdam98/Project_Managment_tool)
