import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateMobileDto } from './dtos/createmobile.dto';
import { DeleteDto } from './dtos/delete.dto';
import { MobilesController } from './mobiles.controller';
import { Mobile } from './mobiles.entity';
import { MobilesService } from './mobiles.service';

describe('MobilesController', () => {
  let controller: MobilesController;
  let mobileservice: Partial<MobilesService>;
  let categoryservice: Partial<CategoryService>;

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
    mobileservice = {
      createMobile: (Mdto: CreateMobileDto, categories: Category[]) => {
        const mobile: Mobile = {
          ...Mdto,
          categories,
          mobile_id: Math.floor(Math.random() * 999999),
        };
        return Promise.resolve(mobile);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobilesController],
      providers: [
        MobilesService,
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryservice,
        },
        {
          provide: getRepositoryToken(Mobile),
          useValue: mobileservice,
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
              getRawOne: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockImplementationOnce((cb) => true),
              execute: jest.fn().mockImplementationOnce((cb) => false),
              getCount: jest.fn().mockImplementationOnce((cb) => 1),
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<MobilesController>(MobilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('categories not defined', async () => {
    const dto: CreateMobileDto = {
      is_private: true,
      title: 'afdasdfasdf',
      text_context: 'sdfsdfsdfsdfsd',
      category: ['hello', 'afddf'],
    };
    categoryservice.findCategory = async () =>
      Promise.resolve(new BadRequestException('categories not found'));
    const mock = jest.spyOn(categoryservice, 'findCategory');
    mock.mockImplementation(() =>
      Promise.resolve(new BadRequestException('categories not found')),
    );
    const result = await controller.createItem(dto);
    expect(result).toEqual(new BadRequestException('categories not found'));
  });

  it('private listings', async () => {
    expect(await controller.GetPublicPhones()).toBeTruthy();
  });

  it('private listings', async () => {
    expect(await controller.Getprivate()).toBeTruthy();
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
    mobileservice.createMobile = async () => Promise.resolve(mobile as Mobile);
    const dto: DeleteDto = {
      id: Math.floor(Math.random() * 999999),
      title: 'afasdfsdf',
    };
    const result: string = await controller.Delete_id(dto);
    expect(result).toEqual('unable to delete id or title');
  });
  it('shoiuld not delete a phone that doesnot exist ', async () => {
    const dto: DeleteDto = {
      id: Math.floor(Math.random() * 999999),
      title: 'afasdfsdf',
    };
    mobileservice.Deletephone = async (): Promise<string> => {
      Promise.resolve('deleted mobile with id:${dto.id}');
      const result = await controller.Delete_id(dto);
      expect(result).toEqual(`deleted mobile with id:${dto.id}`);
      return '';
    };
  });
  it('categories not defined', async () => {
    const dto: CreateMobileDto = {
      is_private: true,
      title: 'afdasdfasdf',
      text_context: 'sdfsdfsdfsdfsd',
      category: ['hello', 'afddf'],
    };
    categoryservice.findCategory = async () =>
      Promise.resolve(new BadRequestException('categories not found'));
    const mock = jest.spyOn(categoryservice, 'findCategory');
    mock.mockImplementation(() => Promise.resolve(1));
    const mock2 = jest.spyOn(mobileservice, 'createMobile'); // spy on foo
    mock.mockImplementation(() =>
      Promise.resolve(new BadRequestException('Mobile already exists')),
    );
    const result = await controller.createItem(dto);
    expect(result).toEqual(new BadRequestException('categories not found'));
  });
});
