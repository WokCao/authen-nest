import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.login(email, pass);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const { password, ...result } = user;
      const payload = { sub: result.id, email: result.email };
      return {
        access_token: await this.jwtService.signAsync(payload)
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      return await this.usersService.register(registerUserDto);
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
