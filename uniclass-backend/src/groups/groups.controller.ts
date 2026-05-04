import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from 
'@nestjs/common';
import { GroupsService } from './groups.service';
import { GenerateGroupsDto } from './dto/generate-groups.dto';
import { MoveStudentDto } from './dto/move-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}
  @Post('courses/:id/groups/generate')
  generate(@Param('id') id: string, @Body() dto: GenerateGroupsDto, @Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.groupsService.generate(+id, dto, token);
  }
  @Get('courses/:id/groups')
  findAll(@Param('id') id: string) {
    return this.groupsService.findAllForCourse(+id);
  }
  @Post('courses/:id/groups/publish')
  publish(@Param('id') id: string) {
    return this.groupsService.publish(+id);
  }
  @Get('groups/:id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }
  @Patch('groups/:id/move-student')
  moveStudent(@Param('id') id: string, @Body() dto: MoveStudentDto) {
    return this.groupsService.moveStudent(+id, dto);
  }
}