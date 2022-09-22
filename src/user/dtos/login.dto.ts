import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() password: string;
}
