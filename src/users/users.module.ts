import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService], //internal provider
  exports: [UsersService], //if others want to use, it needs exporting
})
export class UsersModule {}
