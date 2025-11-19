import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ShoppersService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let shoppersService: {
    findAll: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    shoppersService = {
      findAll: jest.fn(() => ['john']),
      create: jest.fn((name: string) => ({ message: 'added', name })),
      delete: jest.fn((name: string) => ({ message: 'deleted', name })),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: ShoppersService,
          useValue: shoppersService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns all shoppers', () => {
    expect(appController.getShoppers()).toEqual(['john']);
  });

  it('creates a shopper', () => {
    expect(appController.createShopper('Raphael')).toEqual({
      message: 'added',
      name: 'Raphael',
    });
    expect(shoppersService.create).toHaveBeenCalledWith('Raphael');
  });

  it('deletes a shopper', async () => {
    expect(await appController.deleteShopper('Raphael')).toEqual({
      message: 'deleted',
      name: 'Raphael',
    });
    expect(shoppersService.delete).toHaveBeenCalledWith('Raphael');
  });
});
