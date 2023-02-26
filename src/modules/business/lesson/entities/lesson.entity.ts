import { Tag } from '@prisma/client';
import { Category } from '../../category/entities/category.entity';
import { IFile } from '../../global/entity';

export class Lesson {
  id: number;
  title: string;
  description?: string;
  poster?: IFile;
  file?: IFile;
  categories: Category[];
  tags: Tag[];
}
