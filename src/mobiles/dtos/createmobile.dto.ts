import { IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateMobileDto {
  @IsNotEmpty()
  @IsBoolean()
  is_private: boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text_context: string;

  @IsArray()
  category: Array<string>;
}
