import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

// For checking valid email and password
export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}