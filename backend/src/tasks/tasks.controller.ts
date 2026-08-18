import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SeedService } from '../seed/seed.service';
import { CreateTaskDto, UpdateTaskDto, CreateSubtaskDto, UpdateSubtaskDto, CreateCommentDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly seedService: SeedService,
  ) {}

  @Post('reseed')
  async reseed(@Request() req): Promise<any> {
    await this.seedService.seedUserData(req.user._id, req.user.name, true);
    return { success: true, message: 'Figma seed data refreshed cleanly' };
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('projectId') projectId?: string,
  ): Promise<any> {
    return this.tasksService.findAll(req.user._id.toString(), { status, priority, search, projectId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<any> {
    return this.tasksService.findOne(id, req.user._id.toString());
  }

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req): Promise<any> {
    return this.tasksService.create(dto, req.user._id.toString(), req.user.name);
  }

  @Put('reorder')
  async reorder(
    @Body() body: { taskId: string; status: string; targetIndex: number },
    @Request() req,
  ): Promise<any> {
    return this.tasksService.reorderTasks(
      req.user._id.toString(),
      body.taskId,
      body.status,
      body.targetIndex,
    );
  }

  @Put('sort-column')
  async sortColumn(
    @Body() body: { status: string; sortBy: 'priority' | 'dueDate' | 'title'; direction?: 'asc' | 'desc' },
    @Request() req,
  ): Promise<any> {
    return this.tasksService.sortColumnTasks(
      req.user._id.toString(),
      body.status,
      body.sortBy,
      body.direction || 'asc',
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req): Promise<any> {
    return this.tasksService.update(id, dto, req.user._id.toString(), req.user.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req): Promise<any> {
    return this.tasksService.delete(id, req.user._id.toString());
  }

  // --- Subtasks ---

  @Post(':id/subtasks')
  async addSubtask(@Param('id') id: string, @Body() dto: CreateSubtaskDto, @Request() req): Promise<any> {
    return this.tasksService.addSubtask(id, dto, req.user._id.toString(), req.user.name);
  }

  @Put(':id/subtasks/:subtaskId')
  async updateSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ): Promise<any> {
    return this.tasksService.updateSubtask(id, subtaskId, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  async deleteSubtask(@Param('id') id: string, @Param('subtaskId') subtaskId: string): Promise<any> {
    return this.tasksService.deleteSubtask(id, subtaskId);
  }

  // --- Comments ---

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() dto: CreateCommentDto, @Request() req): Promise<any> {
    return this.tasksService.addComment(id, dto, req.user);
  }

  @Post(':id/comments/:commentId/reaction')
  async toggleReaction(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body('emoji') emoji: string,
  ): Promise<any> {
    return this.tasksService.toggleReaction(id, commentId, emoji);
  }
}
