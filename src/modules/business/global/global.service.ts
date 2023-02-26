import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { getAll as getAllCategories } from '../category/category.service';
import { MeiliSearchDto } from './dto/where.dto';

@Injectable()
export class GlobalService {
  constructor(
    private readonly meili: MeiliService,
    private readonly prisma: PrismaService,
  ) {}

  meiliSearch(queries: MeiliSearchDto) {
    return this.meili.client
      .index(queries.index)
      .search(queries.search, {
        filter: queries.filter,
        offset: +queries.offset || 0,
        limit: +queries.limit || 10,
      })
      .then((res) => {
        return {
          hits: res.hits,
          query: res.query,
          count: res.nbHits,
        };
      });
  }

  async main() {
    const [categories, categoriesCount] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: { show: true },
        orderBy: { position: 'asc' },
        select: {
          ...getAllCategories,
          _count: { select: { lessons: true } },
        },
      }),
      this.prisma.category.count({ where: { show: true } }),
    ]);

    return {
      categories: {
        data: categories,
        count: categoriesCount,
      },
    };
  }
}
