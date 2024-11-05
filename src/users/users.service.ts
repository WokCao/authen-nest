import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(email: string, password: string) {
    // Check valid email and correct password, if there is no user -> login failed
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;

    // Hash password before saving to postgresql
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate username or email error code in PostgreSQL
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException('Database errors occur. Please try again...');
      }
    }
  }
}
