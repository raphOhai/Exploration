import { Injectable } from '@nestjs/common';

@Injectable()
export class ShoppersService {
  private shoppers = ['john', 'Sarah', 'Raphael'];

  findAll() {
    return this.shoppers;
  }

  create(name: string) {
    this.shoppers.push(name);
    return { message: 'Shopper added', name };
  }

  async delete(name: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (name === 'john') {
        throw new Error('Shopper not found');
      }
      this.shoppers = this.shoppers.filter((shopper) => shopper !== name);
      return { message: 'Shopper deleted', name };
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message, name };
      }
      return { message: 'Shopper not found', name };
    }
  }
}
