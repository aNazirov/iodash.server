import { IFile } from '../../global/entity';

export class Category {
  id: number;
  title: string;
  poster?: IFile;
  createdAt: string;
}
