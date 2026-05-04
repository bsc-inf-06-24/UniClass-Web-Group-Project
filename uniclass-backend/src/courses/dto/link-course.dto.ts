import { IsString, IsNotEmpty } from 'class-validator';

export class LinkCourseDto {
  @IsString()
  @IsNotEmpty()
  classroomCourseId: string;
}