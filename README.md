# Taskly — Full-Stack Task Management Workspace 🚀

A modern, high-performance, collaborative task management workspace built for the **AbleSpace Technical Assessment**. Designed with exact fidelity to the provided Figma specification, featuring real-time Kanban boards with native drag-and-drop, grouped list views, subtasks tracking, comment threads, dynamic multi-theme customization, and universal keyboard shortcuts.

---

## 🌐 Live Deployment & Key Documentation
- **Live Application:** [https://taskly.thewebvale.com](https://taskly.thewebvale.com)
- **GitHub Repository:** [https://github.com/yashjainbackup9-crypto/taskly](https://github.com/yashjainbackup9-crypto/taskly)
- **Database Architecture & ER Diagram:** [docs/DATABASE_ARCHITECTURE.md](docs/DATABASE_ARCHITECTURE.md)
- **Part 2 AbleSpace "Take Data" Product Analysis:** [docs/ABLESPACE_TAKE_DATA_ANALYSIS.md](docs/ABLESPACE_TAKE_DATA_ANALYSIS.md)
- **SDLC Multi-Agent Team Report:** [docs/SDLC_MULTIAGENT_REPORT.md](docs/SDLC_MULTIAGENT_REPORT.md)

---

## 📊 Database Architecture & Entity Relationships

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns / creates"
    USER ||--o{ TASK : "assigned / created"
    PROJECT ||--o{ TASK : "contains"
    TASK ||--o{ SUBTASK : "has"
    TASK ||--o{ COMMENT : "has"
    TASK ||--o{ AUDIT_LOG : "generates"
    USER ||--o{ COMMENT : "authors"
    COMMENT ||--o{ COMMENT : "parent / replies"

    USER {
        ObjectId _id PK
        string name
        string email
        string username
        string title
        string avatar
        boolean isGuest
        string theme
        string colorMode
    }

    PROJECT {
        ObjectId _id PK
        string name
        string description
        string priority
        string lead
        string dueDate
    }

    TASK {
        ObjectId _id PK
        string title
        string description
        string status
        string priority
        string assignee
        string dueDate
        array labels
        string team
        boolean isLocked
        number watchers
    }

    SUBTASK {
        ObjectId _id PK
        ObjectId taskId FK
        string title
        boolean completed
        string priority
        string dueDate
    }

    COMMENT {
        ObjectId _id PK
        ObjectId taskId FK
        string authorName
        string content
        array reactions
        ObjectId parentId FK
    }

    AUDIT_LOG {
        ObjectId _id PK
        ObjectId taskId FK
        string action
        string details
        date createdAt
    }
```

---

## ⌨️ Universal Keyboard Shortcuts

| Combination | Action | Description |
| :--- | :--- | :--- |
| <kbd>Esc</kbd> | **Universal Dismiss** | Dismisses any active modal, drawer, dropdown, or search bar |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>?</kbd> | **Shortcuts Cheatsheet** | Opens the interactive visual Keyboard Shortcuts modal |
| <kbd>⌘</kbd> + <kbd>N</kbd> | **New Task** | Opens the Create Task modal from anywhere |
| <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> | **New Project** | Opens the Create Project modal |
| <kbd>⌘</kbd> + <kbd>F</kbd> | **Global Search** | Focuses and activates global search |
| <kbd>⌘</kbd> + <kbd>1</kbd> | **Board View** | Switches to Kanban Board View |
| <kbd>⌘</kbd> + <kbd>2</kbd> | **List View** | Switches to Grouped List View |
| <kbd>⌘</kbd> + <kbd>B</kbd> | **Toggle Sidebar** | Expands or collapses the workspace sidebar |
| <kbd>⌘</kbd> + <kbd>D</kbd> | **Toggle Theme** | Switches between Light and Dark mode |

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 with custom CSS variable tokens
- **Icons & Motion:** Lucide React, Framer Motion
- **Interaction:** HTML5 Native Drag and Drop across Kanban columns
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`), 1-Click Guest Login, and Email/Password with session persistence

### Backend
- **Framework:** NestJS 11 (Modular REST Architecture)
- **Database:** MongoDB Atlas (`ablespace` database) via `@nestjs/mongoose` & Mongoose serverless pooling
- **Validation:** Class-Validator DTOs & ValidationPipes
- **Email Service:** Nodemailer SMTP Integration (`info@thewebvale.com`)
- **Security:** JWT authentication, bcrypt password hashing, CORS whitelist

---

## 🚀 1-Click Vercel Single-Project Deployment

Taskly is pre-configured to deploy as a **single full-stack project on Vercel** (with Next.js 15 Serverless API Routes and MongoDB Atlas):

### Option A: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root
vercel
```

### Option B: Deploy via Vercel Dashboard (Git Integration)
1. Import `yashjainbackup9-crypto/taskly` in the [Vercel Dashboard](https://vercel.com/new).
2. Root Directory: `./` (or leave default).
3. Add the following Environment Variables:
   * `MONGODB_URI`: `mongodb+srv://yaashjainn:2CfKwxYEOFqjowmn@webverse.5exbv3u.mongodb.net/ablespace?retryWrites=true&w=majority`
   * `JWT_SECRET`: `dd5f3089-40c3-403d-af14-d0c228b05cb4`
   * `NEXT_PUBLIC_API_URL`: `/api`
   * `CLOUDINARY_CLOUD_NAME`: `ddfkglbwh`
   * `CLOUDINARY_API_KEY`: `347461574359385`
   * `CLOUDINARY_API_SECRET`: `NggcsHXLdudh-JA_BE5Vd5uBvn8`
4. Click **Deploy**. Vercel will automatically build the client and deploy all serverless API routes!

---

## ⚡ Quick Start & Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/yashjainbackup9-crypto/taskly.git
cd taskly
```

### 2. Local Development Run
```bash
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

### 3. Production Build & Run
```bash
npm run build
npm run start
```

---

## 📄 License
This project is licensed under the MIT License.

