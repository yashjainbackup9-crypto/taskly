import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
  isGuest?: boolean;
  theme?: string;
  colorMode?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' },
    googleId: { type: String },
    isGuest: { type: Boolean, default: false },
    theme: { type: String, default: 'dark' },
    colorMode: { type: String, default: 'indigo' },
    role: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

// 2. Project Schema
export interface IProject extends Document {
  name: string;
  key: string;
  description: string;
  priority: string;
  lead: string;
  leadAvatar: string;
  dueDate: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    key: { type: String, default: 'DES' },
    description: { type: String, default: '' },
    priority: { type: String, default: 'High' },
    lead: { type: String, default: 'Dexter' },
    leadAvatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' },
    dueDate: { type: String, default: '12 Sep 2026' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// 3. Task Schema
export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  assigneeAvatar: string;
  members: string[];
  dueDate: string;
  startDate: string;
  labels: string[];
  team: string;
  reporter: string;
  isLocked: boolean;
  watchers: number;
  order: number;
  projectId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, default: 'To Do' },
    priority: { type: String, default: 'High' },
    assignee: { type: String, default: 'Admin' },
    assigneeAvatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' },
    members: { type: [String], default: [] },
    dueDate: { type: String, default: '29 Jul' },
    startDate: { type: String, default: '' },
    labels: { type: [String], default: ['Deployment'] },
    team: { type: String, default: 'Engineering' },
    reporter: { type: String, default: 'Dexter' },
    isLocked: { type: Boolean, default: false },
    watchers: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// 4. Subtask Schema
export interface ISubtask extends Document {
  title: string;
  completed: boolean;
  priority: string;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  taskId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, default: 'Medium' },
    assignee: { type: String, default: 'Admin' },
    assigneeAvatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' },
    dueDate: { type: String, default: '' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  },
  { timestamps: true }
);

// 5. Comment Schema
export interface IComment extends Document {
  content: string;
  author: string;
  authorAvatar: string;
  taskId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  attachments?: string[];
  reactions: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: String, default: 'Dexter' },
    authorAvatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    attachments: { type: [String], default: [] },
    reactions: { type: Map, of: [String], default: {} },
  },
  { timestamps: true }
);

// 6. AuditLog Schema
export interface IAuditLog extends Document {
  action: string;
  actor: string;
  actorAvatar: string;
  taskId: mongoose.Types.ObjectId;
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    actor: { type: String, default: 'You' },
    actorAvatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    details: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Export Mongoose Models with reuse guards for serverless execution
export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export const TaskModel: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export const SubtaskModel: Model<ISubtask> =
  mongoose.models.Subtask || mongoose.model<ISubtask>('Subtask', SubtaskSchema);

export const CommentModel: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
