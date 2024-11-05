import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { User } from 'src/users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    try {
      const user = await this.authService.login(signInDto.email, signInDto.password);
      return { user, message: 'Success' };
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ user: User, message: string }> {
    try {
      const user = await this.authService.register(registerUserDto);
      return { user, message: 'User registered successfully' };
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
