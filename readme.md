# Invoice Flow Pro 

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Production-ready invoice management SaaS application** - Create, send, and track professional invoices with real-time analytics and PDF generation.

## Overview

Invoice Flow Pro is a complete, full-stack invoice management solution that helps businesses streamline their billing process. Built with modern technologies and industry best practices, this application handles everything from user authentication to professional PDF invoice generation.

### Key Features

- **Complete Authentication System** - JWT-based auth with bcrypt password hashing
- **Invoice Management** - Create, edit, delete, and view invoices
-  **PDF Generation** - Professional branded invoices as downloadable PDFs
- **Real-time Calculations** - Automatic tax, discount, and total calculations
- **Dashboard Analytics** - Real-time statistics and performance metrics
- **Client Management** - Store and manage client information
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Security First** - XSS protection, rate limiting, and secure headers
- **Docker Support** - Easy deployment with containerization

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| React Router v6 | Routing |
| React Query | Data Fetching & Caching |
| React Hook Form | Form Management |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API Server |
| MongoDB + Mongoose | Database |
| JWT + Bcrypt | Authentication |
| PDFKit | PDF Generation |
| Helmet + Rate Limit | Security |

## Screenshots

<details>
<summary>Click to view screenshots</summary>

| Dashboard | Invoice Creation |
|-----------|------------------|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard) | ![Create Invoice](https://via.placeholder.com/400x200?text=Create+Invoice) |

| Invoice View | PDF Export |
|--------------|------------|
| ![Invoice View](https://via.placeholder.com/400x200?text=Invoice+View) | ![PDF Export](https://via.placeholder.com/400x200?text=PDF+Export) |

</details>

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 6.0+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/invoice-flow-pro.git
cd invoice-flow-pro

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (in a separate terminal)
mongod

# Start backend server
npm run dev

# Install frontend dependencies (new terminal)
cd ../frontend
npm install

# Start frontend server
npm start


**A Sabtain Ali production**