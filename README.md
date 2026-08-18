# AbleSpace Full Stack Developer Technical Assessment 🚀

Full-Stack Task Management System & Product Teardown built for the **AbleSpace Technical Assessment**.

---

## 🏗️ Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion / Motion.
- **Backend**: NestJS, TypeScript, Prisma ORM, SQLite / PostgreSQL, Class-Validator DTOs, Swagger/OpenAPI.
- **Part 2 Analysis**: Comprehensive Product Workflow & UX/UI Improvement Report for AbleSpace *"Take Data"* system.

---

## 📂 Project Structure
```
ablespace-assessment/
├── frontend/               # Next.js 15 App Router + Tailwind CSS + TypeScript
│   ├── src/
│   │   ├── app/            # App Router pages & layouts
│   │   ├── components/     # Reusable UI components & themes
│   │   ├── context/        # Theme & Auth state providers
│   │   └── types/          # Shared TypeScript interfaces
├── backend/                # NestJS REST API Server
│   ├── src/
│   │   ├── auth/           # Guest login & JWT authentication
│   │   ├── tasks/          # Task CRUD, filters, reordering & status
│   │   ├── categories/     # Task categories / labels
│   │   ├── prisma/         # Prisma schema & database service
│   │   └── main.ts         # NestJS entry point
├── part2-product-analysis/ # Part 2 Product Workflow & UX/UI Teardown
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```

### 2. Frontend (Next.js App Router)
```bash
cd frontend
npm install
npm run dev
```
