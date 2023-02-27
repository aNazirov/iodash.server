import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Utils } from 'src/modules/helpers';
import api from 'src/modules/helpers/api';
import {
  CreateTechnologyDto,
  FilterTechnologyParams,
  UpdateTechnologyDto,
} from './dto/technology.dto';

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
export class TechnologyService {
  private readonly logger = new Logger('TechnologyService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly meili: MeiliService,
    private readonly config: ConfigService,
  ) {}

  async create(params: CreateTechnologyDto) {
    if (!params.title.trim()) {
      return Utils.ErrorHandler(400, null, 'Title should not be empty');
    }

    try {
      const technology = await this.prisma.technology.create({
        data: {
          title: params.title,
          ...(params.iconId
            ? { icon: { connect: { id: params.iconId } } }
            : {}),
        },
        select: getOne,
      });

      await this.meili.technologiesIndex.addDocuments([
        {
          id: technology.id,
          title: technology.title,
        },
      ]);

      return technology;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0, params: FilterTechnologyParams) {
    const where: Prisma.TechnologyWhereInput = {};

    if (params.title) {
      const { hits, nbHits } = await this.meili.technologiesIndex.search(
        params.title,
        {
          offset: skip,
          limit: 10,
        },
      );

      const ids = hits
        .filter((x) => x.title.toLowerCase().includes(x.title.toLowerCase()))
        .map((x) => x.id);

      where.id = { in: ids };

      const [data] = await this.prisma.$transaction([
        this.prisma.technology.findMany({
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
      this.prisma.technology.findMany({
        where,
        select: getOne,
        skip,
        orderBy: {
          id: 'desc',
        },
        take: 15,
      }),
      this.prisma.technology.count({ where }),
    ]);

    return {
      data,
      count,
    };
  }

  async findOne(id: number) {
    try {
      const technology = await this.prisma.technology.findUnique({
        where: { id },
        select: getOne,
      });

      if (!technology)
        return Utils.ErrorHandler(404, null, 'Technology not found');

      return technology;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateTechnologyDto) {
    const candidate = await this.prisma.technology.findUnique({
      where: { id },
    });

    if (!candidate)
      return Utils.ErrorHandler(404, null, `Technology not found`);

    const data: Prisma.TechnologyUpdateInput = {};

    if (params.title && candidate.title !== params.title.trim()) {
      data.title = params.title.trim();
    }

    if (params.iconId && candidate.iconId !== params.iconId) {
      data.icon = { connect: { id: params.iconId } };
    }

    try {
      const technology = await this.prisma.technology.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (data.title) {
        await this.meili.technologiesIndex.updateDocuments([
          {
            id: technology.id,
            title: technology.title,
          },
        ]);
      }

      if (data.icon) {
        await api
          .post(`${this.config.get('fileServer')}/file/delete-many`, {
            ids: [candidate.iconId],
          })
          .catch((e) => this.logger.error(e));
      }

      return technology;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      const technology = await this.prisma.technology.delete({
        where: { id },
      });

      if (!technology) {
        return Utils.ErrorHandler(404, null, 'Technology not found');
      }

      await this.meili.technologiesIndex.deleteDocument(technology.id);

      if (technology.iconId) {
        await api
          .post(`${this.config.get('fileServer')}/file/delete-many`, {
            ids: [technology.iconId],
          })
          .catch((e) => this.logger.error(e));
      }

      return { status: 200, message: 'technology deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
