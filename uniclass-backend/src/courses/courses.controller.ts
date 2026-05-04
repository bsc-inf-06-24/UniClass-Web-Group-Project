import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { LinkCourseDto } from './dto/link-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Req() req) {
    return this.coursesService.findAllByLecturer(req.user.id);
  }

  @Post()
  link(@Body() dto: LinkCourseDto, @Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.coursesService.linkCourse(req.user.id, dto, token);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.unlink(+id);
  }

  @Post(':id/sync')
  sync(@Param('id') id: string, @Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.coursesService.syncStudents(+id, token);
  }

  @Get(':id/students')
  getStudents(@Param('id') id: string, @Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.coursesService.syncStudents(+id, token);
  }

}