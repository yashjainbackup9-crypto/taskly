import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req): Promise<any> {
    return this.projectsService.findAll(req.user._id.toString());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<any> {
    return this.projectsService.findOne(id, req.user._id.toString());
  }

  @Post()
  async create(@Body() data: any, @Request() req): Promise<any> {
    return this.projectsService.create(data, req.user._id.toString(), req.user.name);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req): Promise<any> {
    return this.projectsService.update(id, data, req.user._id.toString());
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req): Promise<any> {
    return this.projectsService.delete(id, req.user._id.toString());
  }
}
