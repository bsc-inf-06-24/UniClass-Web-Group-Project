import { IsNumber, IsOptional } from 'class-validator';
export class GenerateGroupsDto {
  @IsOptional() @IsNumber()
  groupSize?: number;  // e.g. 4 means 4 students per group
  @IsOptional() @IsNumber()
  groupCount?: number; // e.g. 5 means create 5 groups
}