import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Utils } from 'src/modules/helpers';
import { JWTPayload } from '../auth/dto/auth.dto';
import {
  CreateCategoryDto,
  FilterCategoryParams,
  UpdateCategoryDto,
} from './dto/category.dto';

export const getOne = {
  id: true,
  title: true,
  position: true,
  show: true,
};

export const getAll = {
  id: true,
  title: true,
  position: true,
  show: true,
};

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly meili: MeiliService,
  ) {}

  async create(params: CreateCategoryDto) {
    if (!params.title?.trim()) {
      return Utils.ErrorHandler(400, null, 'Title must not be empty');
    }

    try {
      const category = await this.prisma.category.create({
        data: {
          title: params.title.trim(),
          show: params.show,
          position: params.position,
        },
        select: getOne,
      });

      await this.meili.categoriesIndex.addDocuments([
        {
          id: category.id,
          title: category.title,
        },
      ]);

      return category;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0, payload: JWTPayload, params: FilterCategoryParams) {
    const where: Prisma.CategoryWhereInput = {};

    try {
      if (params.title) {
        const { hits, nbHits } = await this.meili.categoriesIndex.search(
          params.title,
          {
            offset: skip,
            limit: 20,
          },
        );

        const ids = hits
          .filter((x) => x.title.toLowerCase().includes(x.title.toLowerCase()))
          .map((x) => x.id);

        where.id = { in: ids };

        const [data] = await this.prisma.$transaction([
          this.prisma.category.findMany({
            where,
            orderBy: {
              position: 'asc',
            },
            select: getAll,
          }),
        ]);

        return {
          data,
          count: nbHits,
        };
      }

      if (typeof params.show === 'boolean') {
        where.show = params.show;
      }

      const [data, count] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          where,
          skip,
          take: 20,
          orderBy: {
            position: 'asc',
          },
          select: getAll,
        }),
        this.prisma.category.count({
          where,
        }),
      ]);

      return {
        data,
        count,
      };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        select: getOne,
      });

      if (!category) return Utils.ErrorHandler(404, null, 'Category not found');

      return category;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateCategoryDto) {
    const candidate = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!candidate) return Utils.ErrorHandler(404, null, 'Category not found');

    const data: Prisma.CategoryUpdateInput = {};

    if (params.title?.trim() && candidate.title !== params.title.trim()) {
      data.title = params.title.trim();
    }

    if (params.position && candidate.position !== params.position) {
      data.position = params.position;
    }

    if (
      ![null, undefined].includes(params.show) &&
      candidate.show !== params.show
    ) {
      data.show = params.show;
    }

    try {
      const category = await this.prisma.category.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (data.title) {
        await this.meili.categoriesIndex.updateDocuments([
          {
            id: category.id,
            title: category.title,
          },
        ]);
      }

      return category;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      const category = await this.prisma.category.delete({
        where: { id },
      });

      if (!category) {
        return Utils.ErrorHandler(404, null, 'Category not found');
      }

      await this.meili.categoriesIndex.deleteDocument(category.id);

      return { status: 200, message: 'Category deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
