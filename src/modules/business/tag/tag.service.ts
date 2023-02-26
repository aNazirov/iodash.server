import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Utils } from 'src/modules/helpers';
import { CreateTagDto, FilterTagParams, UpdateTagDto } from './dto/tag.dto';

export const getOne = {
  id: true,
  title: true,
  icon: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
};

export const getAll = {
  id: true,
  title: true,
  icon: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
};

@Injectable()
export class TagService {
  private readonly logger = new Logger('TagService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly meili: MeiliService,
  ) {}

  async create(params: CreateTagDto) {
    if (!params.title.trim()) {
      return Utils.ErrorHandler(400, null, 'Название не должен быть пустым');
    }

    try {
      const tag = await this.prisma.tag.create({
        data: {
          title: params.title,
        },
        select: getOne,
      });

      await this.meili.tagsIndex.addDocuments([
        {
          id: tag.id,
          title: tag.title,
        },
      ]);

      return tag;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0, params: FilterTagParams) {
    const where: Prisma.TagWhereInput = {};

    if (params.title) {
      const { hits, nbHits } = await this.meili.tagsIndex.search(params.title, {
        offset: skip,
        limit: 10,
      });

      const ids = hits
        .filter((x) => x.title.toLowerCase().includes(x.title.toLowerCase()))
        .map((x) => x.id);

      where.id = { in: ids };

      const [data] = await this.prisma.$transaction([
        this.prisma.tag.findMany({
          where,
          orderBy: {
            id: 'desc',
          },
          select: getOne,
        }),
      ]);

      return {
        data,
        count: nbHits,
      };
    }

    const [data, count] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        where,
        select: getOne,
        skip,
        orderBy: {
          id: 'desc',
        },
        take: 15,
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      data,
      count,
    };
  }

  async findOne(id: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
        select: getOne,
      });

      if (!tag) return Utils.ErrorHandler(404, null, 'Tag not found');

      return tag;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateTagDto) {
    const candidate = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!candidate) return Utils.ErrorHandler(404, null, `Tag not found`);

    const data: Prisma.TagUpdateInput = {};

    if (params.title && candidate.title !== params.title.trim()) {
      data.title = params.title.trim();
    }

    try {
      const tag = await this.prisma.tag.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (data.title) {
        await this.meili.tagsIndex.updateDocuments([
          {
            id: tag.id,
            title: tag.title,
          },
        ]);
      }

      return tag;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      const tag = await this.prisma.tag.delete({
        where: { id },
      });

      if (!tag) {
        return Utils.ErrorHandler(404, null, 'Tag not found');
      }

      await this.meili.tagsIndex.deleteDocument(tag.id);

      return { status: 200, message: 'Tag deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
