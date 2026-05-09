import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [TypeOrmModule.forFeature([Group]), CoursesModule, UsersModule],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],  
})
export class GroupsModule {}