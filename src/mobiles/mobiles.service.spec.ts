import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateMobileDto } from './dtos/createmobile.dto';
import { DeleteDto } from './dtos/delete.dto';
import { Mobile } from './mobiles.entity';
import { MobilesService } from './mobiles.service';

describe('MobilesService', () => {
  let service: MobilesService;
  let categoryservice: Partial<CategoryService>;
  let mobileRepo: Repository<Mobile>;
  beforeEach(async () => {
    const categoriesList: Category[] = [];
    categoryservice = {
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
        MobilesService,
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryservice,
        },
        {
          provide: getRepositoryToken(Mobile),
          useValue: mobileRepo,
        },
        {
          provide: getRepositoryToken(Mobile),
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
              getRawMany: jest.fn().mockImplementationOnce((cb) => true),
              execute: jest.fn().mockImplementationOnce((cb) => false),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<MobilesService>(MobilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shoiuld not delete a phone that doesnot exist ', async () => {
    const categories: Category[] = [];
    const num = Math.floor(Math.random() * 999999);
    const cat = {
      id: num,
      category: num.toString(),
    } as unknown as Category;
    categories.push(cat);

    const Mdto: CreateMobileDto = {
      is_private: false,
      title: 'fsdlfnsdifn',
      text_context: 'wfniweniw',
      category: [],
    };

    const mobile: Mobile = {
      ...Mdto,
      categories,
      mobile_id: Math.floor(Math.random() * 999999),
    };
    service.createMobile = async () => Promise.resolve(mobile as Mobile);
    const dto: DeleteDto = {
      id: Math.floor(Math.random() * 999999),
      title: 'afasdfsdf',
    };
    const result: string = await service.Deletephone(dto);
    expect(result).toEqual('unable to delete id or title');
  });

  it('creates a new mobile ', async () => {
    const categories: Category[] = [];
    const num = Math.floor(Math.random() * 999999);
    const cat = {
      id: num,
      category: num.toString(),
    } as unknown as Category;
    categories.push(cat);

    const Mdto: CreateMobileDto = {
      is_private: false,
      title: 'fsdlfnsdifn',
      text_context: 'wfniweniw',
      category: [],
    };
    const mobile: Mobile = {
      ...Mdto,
      categories,
      mobile_id: Math.floor(Math.random() * 999999),
    };
    const mock = jest.spyOn(mobileRepo, 'save');
    mock.mockImplementation(() => Promise.resolve(mobile));
    const li: [Category] = [cat];

    const result = await service.createMobile(Mdto, categories);
    const TestMobile = {
      is_private: false,
      title: 'fsdlfnsdifn',
      text_context: 'wfniweniw',
      categories: [cat],
    };
    expect(result).toEqual(TestMobile);
  });


  it('public listings', async () => {
    expect(await service.getPrivatelistings()).toBeTruthy();
  });

  it('private listings', async () => {
    expect(await service.getPubliclistings()).toBeTruthy();
  });
});
