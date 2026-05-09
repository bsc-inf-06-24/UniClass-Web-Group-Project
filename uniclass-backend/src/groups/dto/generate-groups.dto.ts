import { IsNumber, IsOptional } from 'class-validator';
export class GenerateGroupsDto {
  @IsOptional() @IsNumber()
  groupSize?: number;  //how many students per group
  @IsOptional() @IsNumber()
  groupCount?: number; // no of grups to create
}