import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class DeleteDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  title: string;
}
