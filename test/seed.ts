import { Category } from 'src/mobiles/category.entity';
import { Repository } from 'typeorm/repository/Repository';

export class Seeder {
  constructor(private catRepo: Repository<Category>) {}
  async AddCategory(): Promise<void> {
    const category = new Category();
    category.category = 'A';
    await this.catRepo.save(category);

    const category2 = new Category();
    category.category = 'B';
    await this.catRepo.save(category2);
    return;
  }
}
