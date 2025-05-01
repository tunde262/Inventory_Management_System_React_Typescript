# Inventory Management System – React Frontend

A modern, responsive web application for inventory management built with **React**, **TypeScript**, and **TailwindCSS**, seamlessly connected to a custom **Java SQL REST API backend**. This system enables efficient product management through an intuitive interface, role-based access control, and real-time interaction using modern frontend technologies.

---

## 🚀 Project Description

This project serves as the frontend for a fully functional inventory management system. It empowers users to **authenticate securely**, **manage product records**, and **visualize data** through an elegant UI. The app leverages robust architectural practices, including **TypeScript typing**, **modular components**, and **state-driven UI rendering**.

---

## 🛠️ Tech Stack

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
| Testing (Backend Only)| Jest, React Testing Library    |

---

## ✅ Features

- 🔐 JWT or Session-based Authentication
- 🔁 Authentication State Management with refresh/expiration handling
- 🔒 Role-Based Access Control (RBAC)
- 📦 CRUD Operations on Products
- 🔍 Product Search, Filtering, Sorting
- 📤 Image Uploads & Bulk Product Creation
- 🗑️ Soft Delete & Bulk Deletion Support
- ⚛️ Fully Typed React Components with Hooks
- 📱 Responsive UI using TailwindCSS + ShadCN
- ⏳ Loading and Error States with Feedback
- 🔁 Optimistic UI Updates
- 📊 Pagination, Filtering, and Data Display
- 🔄 Axios-based API Integration
- 🧪 Backend Test Coverage with Jest

---

## 📓 User Stories & Acceptance Criteria

### 🔑 Authentication & Authorization

**User Login**
- Email/password login form using ShadCN components
- Secure JWT (in-memory) or Session-based (cookie) implementation
- Error handling and protected routes

**Auth State Management**
- Token/session refresh mechanism
- Auto-logout on expiration
- Redirects on invalid session/token

**RBAC**
- Show/hide UI features based on role
- Protect routes via TanStack Router
- Graceful handling of unauthorized access

---

### 📦 Product Management

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
- Soft delete implementation
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

## Testing (Backend Only)

- Unit and integration tests using Jest
- Simulated API request tests
- Mocked services and edge-case handling

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
