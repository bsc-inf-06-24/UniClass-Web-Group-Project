import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { LinkCourseDto } from './dto/link-course.dto';

@Controller('api/v1/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Post()
  link(@Body() dto: LinkCourseDto) {
    return this.coursesService.linkCourse(dto);
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
  sync(@Param('id') id: string) {
    return this.coursesService.syncStudents(+id);
  }

  @Get(':id/students')
  getStudents(@Param('id') id: string) {
    return this.coursesService.syncStudents(+id);
  }

}