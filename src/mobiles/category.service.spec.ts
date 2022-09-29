import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

describe('CetegoryService', () => {
  let service: CategoryService;
  let catservice: Partial<CategoryService>;

  beforeEach(async () => {
    const categoriesList: Category[] = [];
    catservice = {
      AddCategory: (categories: string[]) => {
        const num = Math.floor(Math.random() * 999999);
        const cat = {
          id: num,
          category: num.toString(),
        } as unknown as Category;
        categoriesList.push(cat);
        return Promise.resolve(categoriesList);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: catservice,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnThis(),
              delete: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              getRawOne: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockImplementationOnce((cb) => true),
              execute: jest.fn().mockImplementationOnce((cb) => false),
              getCount: jest.fn().mockImplementationOnce((cb) => 1),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findCategory function throws error', async () => {
    const mock = jest.spyOn(service, 'findCategory'); // spy on foo
    mock.mockImplementation(() =>
      Promise.resolve(new BadRequestException('categories not found')),
    );
    const categories: string[] = ['abc', 'aadfoisdf'];
    const result = await service.findCategory(categories);
    const expectedValue = new BadRequestException('categories not found');
    expect(result).toEqual(expectedValue);
    jest.restoreAllMocks();
  });

  it('finds the category', async () => {
    const categories: string[] = ['abc'];
    const result = await service.findCategory(categories);
    expect(result).toEqual(1);
    jest.restoreAllMocks();
  });

  it('adds category', async () => {
    const categories: string[] = ['abc'];
    const result = await service.AddCategory(categories);
    expect(result[0].category).toEqual('abc');
  });
});
