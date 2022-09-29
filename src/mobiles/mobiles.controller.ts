import { Controller, Post, Body, Delete, Get, UseGuards } from '@nestjs/common';
import { Mobile } from './mobiles.entity';
import { MobilesService } from './mobiles.service';
import { CreateMobileDto } from './dtos/createmobile.dto';
import { CategoryService } from './category.service';
import { DeleteDto } from './dtos/delete.dto';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';

@Controller('mobiles')
export class MobilesController {
  constructor(
    private readonly mobileservice: MobilesService,
    private catservice: CategoryService,
  ) {}

  @UseGuards(AuthGuard())
  @Post('/createitem')
  async createItem(@Body() createItemDto: CreateMobileDto) {
    const categories: Array<string> = createItemDto.category;

    const CategoryExists = await this.catservice.findCategory(categories);
    if (CategoryExists === 1) {
      const CategoryArr = await this.catservice.AddCategory(categories);
      return await this.mobileservice.createMobile(createItemDto, CategoryArr);
    } else {
      return CategoryExists;
    }
  }

  @UseGuards(AuthGuard())
  @Delete('/deletelisting')
  async Delete_id(@Body() deletedto: DeleteDto): Promise<string> {
    const delete_id = this.mobileservice.Deletephone(deletedto);
    return delete_id;
  }

  @UseGuards(AuthGuard())
  @Get('/privatelistings')
  async Getprivate() {
    return this.mobileservice.getPrivatelistings();
  }

  @Get('/phones')
  async GetPublicPhones() {
    return this.mobileservice.getPubliclistings();
  }
}
