# Taskly — Full-Stack Task Management Workspace 🚀

A modern, high-performance, collaborative task management workspace built for the **AbleSpace Technical Assessment**. Designed with exact fidelity to the provided Figma specification, featuring real-time Kanban boards, grouped list views, subtasks tracking, comment threads, and dynamic multi-theme customization.

---

## 🌐 Live Deployment & Repository
- **Live Application:** [https://taskly.thewebvale.com](https://taskly.thewebvale.com)
- **GitHub Repository:** [https://github.com/yashjainbackup9-crypto/taskly](https://github.com/yashjainbackup9-crypto/taskly)
- **Part 2 Product Report:** [AbleSpace "Take Data" UX/UI Teardown](docs/ABLESPACE_TAKE_DATA_ANALYSIS.md)

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 with custom CSS variable tokens
- **Icons & Motion:** Lucide React, Framer Motion
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`), 1-Click Guest Login, and Email/Password with session persistence

### Backend
- **Framework:** NestJS 11 (Modular REST Architecture)
- **Database:** MongoDB Atlas (`ablespace` database) via `@nestjs/mongoose`
- **Validation:** Class-Validator DTOs & ValidationPipes
- **Email Service:** Nodemailer SMTP Integration (`info@thewebvale.com`)
- **Security:** JWT authentication, bcrypt password hashing, CORS whitelist

---

## ✨ Features & Design Fidelity

| Screen / Feature | Figma Alignment | Implementation Details |
| :--- | :--- | :--- |
| **1. Authentication** | `01_login_guest_screen.png` | 1-Click Guest Login, Google OAuth, Email/Password accordion, terms & privacy footer |
| **2. Kanban Board View** | `02_board_view.png` | 4 status columns (**To Do**, **Doing**, **Completed**, **On Hold**) with drag handles, card counts, quick inline task creation, and tag badges |
| **3. Grouped List View** | `04_list_view.png` | Collapsible status tables with Priority signal bars, Member avatar stacks, Due dates, and inline row insertion |
| **4. Fields & View Switcher** | `03_fields_dropdown_view_switcher.png` | `[List / Board]` view switcher toggle and column visibility controls (Priority, Members, Due Date, Labels, Status, Reporter) |
| **5. Filter System** | `11_filter_menu_priority_submenu.png` | Multi-level dropdown filtering by Status and Priority (Urgent, High, Medium, Low, No Priority) |
| **6. Fast Search (`⌘F`)** | `05_search_filter_active.png` | Global search filtering by task title, description, labels, and assignees with keyboard shortcut |
| **7. Task Details Drawer** | `06_task_detail_page_subtasks_comments.png` | Editable title/desc, action icons (Lock, Watchers, Share, Maximize), subtasks table, real-time comments with emoji reactions and replies |
| **8. Interactive Calendar Picker** | `08_date_picker_calendar.png` | Date range popover (`Jan 10 -> End`) with month matrix navigation and highlighted date selection |
| **9. Theme Engine** | `09_profile_menu_theme_switcher.png` | **Light Theme** & **Obsidian Dark Theme** with instant DOM updates and localStorage persistence |
| **10. Color Mode Palettes** | `10_color_mode_palette_switcher.png` | 6 brand accent modes (**Amber**, **Blue**, **Pink**, **Rose**, **Emerald**, **Black**) |
| **11. Projects & Breadcrumbs** | `12_projects_breadcrumb_tasks_view.png` | `Projects > Design Homepage` navigation hierarchy with project metadata tables |
| **12. Profile & Settings** | `13_settings_profile_page.png` | Profile avatar, email editing, name, title, username, and workspace departure |

---

## 📂 Project Structure

```
taskly/
├── frontend/                     # Next.js 15 App Router
│   ├── src/
│   │   ├── app/                  # (auth)/login, (dashboard)/tasks, /projects, /settings
│   │   ├── components/
│   │   │   ├── board/            # KanbanBoard, KanbanColumn, TaskCard
│   │   │   ├── list/             # TaskListView, GroupSection, TaskRow
│   │   │   ├── task-details/     # TaskDetailDrawer, SubtasksTable, CommentStream, TaskMetadataSidebar
│   │   │   ├── navigation/       # Sidebar, TopHeader, UserProfileMenu
│   │   │   ├── dropdowns/        # FieldsDropdown, FilterMenu, DatePickerPopover
│   │   │   └── ui/               # PrioritySignal, StatusBadge, TagPill, Avatar
│   │   ├── context/              # AuthContext, TaskContext, ThemeContext
│   │   ├── lib/                  # api client, constants, utils
│   │   └── types/                # TypeScript interfaces
├── backend/                      # NestJS REST API
│   ├── src/
│   │   ├── auth/                 # Guest, Google OAuth, Email/Password, JWT Strategy & Guard
│   │   ├── tasks/                # Task & Subtask CRUD, Comments, Audit Logs
│   │   ├── projects/             # Projects directory & task aggregation
│   │   ├── users/                # Profile, Theme, and Color Mode preferences
│   │   ├── email/                # Nodemailer welcome notifications
│   │   ├── schemas/              # Mongoose schemas (User, Task, Subtask, Comment, Project, AuditLog)
│   │   └── seed/                 # Automatic Figma demo data populator
├── docs/                         # Part 2 AbleSpace "Take Data" Product Analysis
│   ├── ABLESPACE_TAKE_DATA_ANALYSIS.md
│   └── assets/                   # Annotated screenshots
├── figma/                        # Figma design reference screenshots
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js >= 18.x
- npm / yarn / pnpm

### 1. Clone Repository
```bash
git clone https://github.com/yashjainbackup9-crypto/taskly.git
cd taskly
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```
*The backend API will run on `http://localhost:5001/api`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 🧪 Testing & Validation
- **Backend Build:** `npm run build` in `backend/` (Zero TypeScript/NestJS errors)
- **Frontend Build:** `npm run build` in `frontend/` (Zero Next.js App Router errors)
- **Linting:** Verified with TypeScript strict mode enabled.

---

## 📄 License
This project is licensed under the MIT License.
