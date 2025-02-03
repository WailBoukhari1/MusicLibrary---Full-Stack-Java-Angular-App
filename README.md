# 🎵 Music Library Application

A full-stack music library application built with **Spring Boot** for the backend and **Angular** for the frontend. This application provides a seamless experience for managing and listening to music, with features like user authentication, playlist creation, album management, and more.

## 🌟 Features

### Frontend (Angular)
- 🎨 **Modern Material Design UI**: A sleek and intuitive user interface.
- 🔐 **JWT Authentication**: Secure user login and registration.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.
- 🎵 **Music Player**: Play, pause, skip, and control music playback.
- 📊 **Admin Dashboard**: Manage users, albums, and playlists.
- 🖼️ **Album Management**: Add, edit, and delete albums.
- 🎧 **Playlist Creation**: Create and manage custom playlists.

### Backend (Spring Boot)
- 🔒 **Secure REST API**: Protected endpoints for secure data handling.
- 🎫 **JWT Authentication**: Token-based authentication for secure access.
- 📁 **File Upload/Download**: Upload and stream music files.
- 🗄️ **MongoDB Integration**: Scalable NoSQL database for storing data.
- 🧪 **Unit Tests**: Comprehensive testing for backend functionality.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB 6+
- Docker (optional)

### Backend Setup
```bash
cd backend
# Build the project
./mvnw clean install
# Run the application
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Run the application
npm start
```

### 🐳 Docker Setup

#### Using Docker Compose
```bash
# Start all services
docker-compose up -d
# Stop all services
docker-compose down
```

#### Individual Container Setup
```bash
# Build and run backend
cd backend
docker build -t music-app-backend .
docker run -p 8080:8080 music-app-backend

# Build and run frontend
cd frontend
docker build -t music-app-frontend .
docker run -p 80:80 music-app-frontend
```

## 📚 Documentation

### API Documentation
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Postman Collection**: `backend/postman/Music_API.postman_collection.json`

### Application URLs
- **Frontend**: `http://localhost:4200`
- **Backend API**: `http://localhost:8080`
- **MongoDB**: `mongodb://localhost:27017`

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure
```
music-library/
├── frontend/              # Angular application
│   ├── src/
│   │   ├── app/           # Angular components and services
│   │   ├── assets/        # Static assets (images, styles, etc.)
│   │   └── environments/  # Environment configurations
│   ├── Dockerfile         # Docker configuration for frontend
│   └── README.md          # Frontend-specific documentation
│
├── backend/               # Spring Boot application
│   ├── src/
│   │   ├── main/          # Main application code
│   │   └── test/          # Unit and integration tests
│   ├── Dockerfile         # Docker configuration for backend
│   └── README.md          # Backend-specific documentation
│
└── docker-compose.yml     # Docker composition for the entire application
```

## 👥 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License
This project is licensed under the **MIT License** - see the LICENSE file for details.

## 🖼️ Preview Images
<!-- Add your images here -->
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
