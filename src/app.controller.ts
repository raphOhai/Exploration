import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ShoppersService } from './app.service';

@Controller('shoppers')
export class AppController {
  constructor(private readonly shoppersService: ShoppersService) {}

  @Get()
  getShoppers() {
    return this.shoppersService.findAll();
  }

  @Post()
  createShopper(@Body('name') name: string) {
    return this.shoppersService.create(name);
  }

  @Delete(':id')
  deleteShopper(@Param('id') id: string) {
    return this.shoppersService.delete(id);
  }
}
