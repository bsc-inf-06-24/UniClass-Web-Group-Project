import { IsNumber, IsString } from 'class-validator';
export class MoveStudentDto {
  @IsString() studentRegNumber: string;
  @IsNumber() targetGroupId: number;
}