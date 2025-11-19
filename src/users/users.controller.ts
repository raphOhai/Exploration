import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }



  @Post('message')
  sendMessage(@Body() message: unknown) {
    return this.usersService.sendMessage('user-created', message);
  }
}
