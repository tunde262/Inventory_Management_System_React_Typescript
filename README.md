# Inventory Management System – React Frontend

A simple, responsive web app for inventory management built with **React**, **TypeScript**, and **TailwindCSS**. This system enables efficient product management through a simple interface, role-based access control, and is built using modern frontend technologies.

![thumbnail](https://github.com/tunde262/Inventory_Management_System_React_Typescript/blob/main/assets/thumbnail.png?raw=true)

---

## Project Description

This project serves as the frontend for a basic inventory management system. It allows e-commerce / brick-and-mortar owners to **manage products** and **sign in / register securely** through a very simple UI. The app leverages a Java-Spring Backend API that depends on a PostgrSQL database. The code architectural practices, include **TypeScript typing**, **modular components**, and **state-driven UI rendering**.

---

## Tech Stack

| Category              | Technology                     |
|-----------------------|--------------------------------|
| Framework             | React                          |
| Language              | TypeScript                     |
| Styling               | TailwindCSS, ShadCN UI         |
| Routing               | TanStack Router                |
| State Management      | TanStack Query                 |
| HTTP Client           | Axios                          |
| Build Tool            | Vite                           |
| Version Control       | Git                            |
| Testing (Backend Only)| JUnit, Mockito                 |

---

## Features

- JWT or Session-based Authentication
- Authentication State Management with refresh/expiration handling
- Role-Based Access Control (RBAC)
- CRUD Operations on Products
- Product Search, Filtering, Sorting
- Image Uploads & Bulk Product Creation
- Soft Delete & Bulk Deletion Support
- Fully Typed React Components with Hooks
- Responsive UI using TailwindCSS + ShadCN
- Loading and Error States with Feedback
- Optimistic UI Updates
- Pagination, Filtering, and Data Display
- Axios-based API Integration
- Backend Test Coverage with Jest

---

## User Stories & Acceptance Criteria

### Authentication & Authorization

**User Login**
- Email/password login form using ShadCN components
- Secure JWT (in-memory) or Session-based (cookie) implementation
- Error handling and protected routes

**Auth State Management**
- JWT Tokens
- Redirects on invalid token

**Role-Based Access Control**
- Show/hide UI features based on role
- Protect routes via TanStack Router
- Graceful handling of unauthorized access

---

### Product Management

**View Products**
- Fetch via TanStack Query
- Show loaders, errors, and paginated product list
- Filtering by category, sorting

**Search Products**
- Real-time search with debounce
- Filter by name, description
- Show "No results" message

**Add Product**
- Validated form (with image upload and bulk creation)
- Success/error notifications
- Form reset on success

**Edit Product**
- Pre-filled form for editing
- Success/error feedback

**Delete Product**
- Confirmation modal before delete
- Bulk delete support

---

## Technical Highlights

### React Implementation
- Component-based architecture
- Custom hooks for API/data logic
- Strong TypeScript usage

### Styling & UX
- Fully responsive using TailwindCSS
- Accessible, interactive components via ShadCN
- Consistent design language

### API Integration
- Axios with global interceptors
- Full error/loading management
- Query caching and real-time feedback

---

## Getting Started

# Clone the repo

```bash
git clone https://github.com/your-username/inventory-frontend.git
cd inventory-frontend
```

# Install dependencies

```bash
npm install
```

# Run the development server

```bash
npm run dev
```
