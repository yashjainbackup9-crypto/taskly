import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Task, TaskSchema } from '../schemas/task.schema';
import { Subtask, SubtaskSchema } from '../schemas/subtask.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Subtask.name, schema: SubtaskSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
