# Taskly Database Architecture & Entity Relationship Diagrams 🗄️

Comprehensive database schema documentation, ER diagrams, indexing strategies, and architectural relationships for the **Taskly Full-Stack System**.

---

## 📊 Entity Relationship Diagram (Mermaid ERD)

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
        string name "Full Name"
        string email "Unique lowercase email"
        string username "Handle"
        string title "Job Title or Role"
        string avatar "Avatar URL"
        boolean isGuest "Guest account flag"
        string passwordHash "Bcrypt hashed password"
        string googleId "Google OAuth sub ID"
        string theme "light | dark"
        string colorMode "amber | blue | pink | rose | emerald | black"
        date createdAt
        date updatedAt
    }

    PROJECT {
        ObjectId _id PK
        string name "Project Title"
        string description "Project Summary"
        string slug "URL Slug"
        string priority "Urgent | High | Medium | Low | No Priority"
        string lead "Lead Member Name"
        string leadAvatar "Lead Avatar URL"
        string dueDate "Formatted Target Date"
        ObjectId ownerId FK "Ref -> USER"
        date createdAt
        date updatedAt
    }

    TASK {
        ObjectId _id PK
        string title "Task Title"
        string description "Detailed Markdown Spec"
        string status "To Do | Doing | Completed | On Hold | Backlog"
        string priority "Urgent | High | Medium | Low | No Priority"
        string assignee "Assignee Name"
        string assigneeAvatar "Assignee Avatar URL"
        array members "Assigned User Names"
        string dueDate "Target Due Date (e.g., 29 Jul)"
        string startDate "Start Date (e.g., Jan 10)"
        array labels "Taxonomy Tags"
        string team "Engineering | Design | QA | DevOps"
        string reporter "Reporter Name"
        boolean isLocked "Lock flag"
        number watchers "Watchers Count"
        number order "Column Sort Index"
        ObjectId projectId FK "Ref -> PROJECT"
        ObjectId userId FK "Ref -> USER"
        date createdAt
        date updatedAt
    }

    SUBTASK {
        ObjectId _id PK
        ObjectId taskId FK "Ref -> TASK"
        string title "Subtask Objective"
        boolean completed "Completion Checkbox"
        string priority "Urgent | High | Medium | Low | No Priority"
        string assignee "Subtask Assignee"
        string assigneeAvatar "Avatar URL"
        string dueDate "Due Date"
        number order "Order Index"
        date createdAt
        date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId taskId FK "Ref -> TASK"
        string authorName "Commenter Name"
        string authorAvatar "Avatar URL"
        string authorEmail "Email"
        string content "Rich Markdown / Text Body"
        array reactions "Emoji Reaction List"
        array attachments "Attached Document URLs"
        ObjectId parentId FK "Ref -> COMMENT (Self-Ref)"
        date createdAt
        date updatedAt
    }

    AUDIT_LOG {
        ObjectId _id PK
        ObjectId taskId FK "Ref -> TASK"
        string userName "Actor Name"
        string userAvatar "Actor Avatar URL"
        string action "Event Description"
        string details "Diff payload"
        date createdAt
    }
```

---

## ⚡ Indexing & Query Optimization Strategy

| Collection | Compound / Single Index | Purpose |
| :--- | :--- | :--- |
| **`users`** | `{ email: 1 }` *(Unique)* | High-speed authentication lookups & Google OAuth deduplication |
| **`tasks`** | `{ userId: 1, status: 1, order: 1 }` | Fast Kanban board column retrieval and sort order preservation |
| **`tasks`** | `{ projectId: 1 }` | Project-scoped task directory queries |
| **`tasks`** | `{ title: "text", description: "text", labels: "text" }` | Instant `⌘F` full-text search matching |
| **`subtasks`** | `{ taskId: 1, order: 1 }` | Subtasks table ordering and cascade deletions |
| **`comments`** | `{ taskId: 1, createdAt: 1 }` | Threaded activity stream chronological sorting |
| **`audit_logs`** | `{ taskId: 1, createdAt: -1 }` | Real-time updates feed descending audit log |

---

## 🔄 Lifecycle & Cascade Constraints

1. **Task Deletion Cascade**:
   - When a `Task` document is deleted, all associated `Subtasks`, `Comments`, and `AuditLogs` referencing `taskId` are atomically purged via `deleteMany()`.
2. **Audit Trail Automation**:
   - Updates to `Task.priority` or `Task.status` automatically generate and persist an `AuditLog` entry (e.g. *"You changed priority from High to Urgent"*).
3. **Session & Preference Sync**:
   - User `theme` (*light / dark*) and `colorMode` (*amber, blue, pink, rose, emerald, black*) are written to MongoDB on update, ensuring cross-device consistency.
