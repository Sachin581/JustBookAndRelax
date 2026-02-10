# JustBookAndRelax

Full-stack application with Spring Boot backend and React + Vite frontend.

## Prerequisites

- Java 17
- Maven
- Node.js & npm
- MySQL

## Database Setup

1. Create a MySQL database named `justbookandrelax`.
2. Configure username/password in `backend/src/main/resources/application.properties` if different from `root`/`Sachin@123`.

## Backend Setup (Spring Boot)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

## Frontend Setup (React + Vite)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Project Structure

- `backend`: Spring Boot application.
- `frontend`: React + Vite application.
