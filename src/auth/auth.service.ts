
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async login(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.login(email, pass);
      if (user === null) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      // TODO: Generate a JWT and return it here
      // instead of the user object
      return result;
    } catch (error) {
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
