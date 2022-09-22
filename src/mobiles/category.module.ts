import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
