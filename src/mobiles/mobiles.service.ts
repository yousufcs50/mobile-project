import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateMobileDto } from './dtos/createmobile.dto';
import { Mobile } from './mobiles.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeleteDto } from './dtos/delete.dto';

@Injectable()
export class MobilesService {
  constructor(
    @InjectRepository(Mobile)
    private mobileRepo: Repository<Mobile>,
  ) {}
  async createMobile(
    CreateMobileDto: CreateMobileDto,
    categories: Array<Category>, // Make the param accept list of categories
  ) {
    const title: string = CreateMobileDto.title;
    const text_context: string = CreateMobileDto.text_context;
    const is_private: boolean = CreateMobileDto.is_private;

    const newItem = {
      is_private,
      title,
      text_context,
      categories,
    };
    try {
      await this.mobileRepo.save(newItem);
    } catch (err) {
      return new BadRequestException('Mobile already exists');
    }
    return newItem as Mobile;
  }

  async Deletephone(dto: DeleteDto): Promise<string> {
    const execute = await this.mobileRepo
      .createQueryBuilder()
      .delete()
      .from('mobile')
      .where('mobile_id = :id or title = :title', {
        id: dto.id,
        title: dto.title,
      })
      .execute();
    if (execute.affected == 0 || !execute) {
      return 'unable to delete id or title';
    }

    return `deleted mobile with id:${dto.id || dto.title}`;
  }

  async getPrivatelistings() {
    return await this.mobileRepo
      .createQueryBuilder()
      .select('*')
      .where('is_private = 1')
      .getRawMany();
  }
  async getPubliclistings() {
    return await this.mobileRepo
      .createQueryBuilder()
      .select('*')
      .where('is_private = 0')
      .take(5)
      .skip(0)
      .getRawMany();
  }
}
