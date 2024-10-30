
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async addOne(username: string, pass: string) {
    const user = await this.findOne(username);
    if (user) {
      throw new Error('Username already exists');
    }
    const newUser = { userId: Date.now(), username, password: pass };
    this.users.push(newUser);
    return newUser;
  }
}
