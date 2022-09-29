import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stringify } from 'querystring';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
  ) {}

  async AddCategory(categories: string[]): Promise<Category[]> {
    let categories_arr: Category[] = new Array<Category>();

    for (let i = 0; i < categories.length; i++) {
      let cat = new Category();
      cat.category = categories[i];
      const categoryId = await this.catRepo
        .createQueryBuilder()
        .select('category.category_id')
        .where('category.category = :id', { id: categories[i] })
        .getRawOne();
      cat.category_id = categoryId.category_id;
      categories_arr.push(cat);
    }
    return categories_arr;
  }

  async findCategory(categories: string[]) {
    const cat_ids = await this.catRepo
      .createQueryBuilder()
      .select('category.category_id')
      .where('category.category IN (:...cats)', { cats: categories })
      .getCount();

    if (categories.length == cat_ids) {
      return 1;
    } else {
      return new BadRequestException('categories not found');
    }
  }
}
