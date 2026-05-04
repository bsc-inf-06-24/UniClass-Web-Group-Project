import { IsNumber } from 'class-validator';
export class MoveStudentDto {
  @IsNumber() studentId: number;
  @IsNumber() targetGroupId: number;
}