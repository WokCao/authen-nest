
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }

  async register(username: string, pass: string): Promise<any> {
    let result = null;
    try {
        result = await this.usersService.addOne(username, pass);
    } catch (error) {
        throw new ConflictException(error.message);
    }
    return result;
  }
}
