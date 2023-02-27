import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import moment from 'moment';
import { Utils } from 'src/modules/helpers';
import api from 'src/modules/helpers/api';
import { JWTPayload } from '../auth/dto/auth.dto';
import { getOne as getOneUser } from '../user/user.service';
import {
  CreateLessonDto,
  FilterFullLessonParams,
  UpdateLessonDto,
} from './dto/lesson.dto';

export const getOne = {
  id: true,
  title: true,
  description: true,
  categories: {
    select: {
      id: true,
      title: true,
    },
  },
  technologies: {
    select: {
      id: true,
      title: true,
      icon: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  },
  tags: {
    select: {
      id: true,
      title: true,
    },
  },
  poster: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
  price: true,
  _count: {
    select: {
      downloads: true,
      views: true,
    },
  },
};

export const getMany = {
  id: true,
  title: true,
  description: true,
  poster: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
  categories: {
    select: {
      id: true,
      title: true,
    },
  },
  technologies: {
    select: {
      id: true,
      title: true,
      icon: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  },
  tags: {
    select: {
      id: true,
      title: true,
    },
  },
  file: {
    select: {
      id: true,
      name: true,
    },
  },
  price: true,
};

@Injectable()
export class LessonService {
  private readonly logger = new Logger('LessonService');
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly meili: MeiliService,
  ) {}

  async create(params: CreateLessonDto) {
    if (!params.title?.trim()) {
      return Utils.ErrorHandler(400, null, 'Title must not be empty');
    }

    try {
      const lesson = await this.prisma.lesson.create({
        data: {
          title: params.title.trim(),
          file: { connect: { id: params.fileId } },
          poster: { connect: { id: params.posterId } },
          price: params.price,
          ...(params.description
            ? { description: params.description.trim() }
            : {}),
          ...(params.categories?.length
            ? {
                categories: {
                  connect: params.categories.map((id) => ({ id })),
                },
              }
            : {}),
          ...(params.tags?.length
            ? {
                tags: { connect: params.tags.map((id) => ({ id })) },
              }
            : {}),
          ...(params.technologies?.length
            ? {
                technologies: {
                  connect: params.technologies.map((id) => ({ id })),
                },
              }
            : {}),
        },
        select: getOne,
      });

      await this.meili.lessonsIndex.addDocuments([
        {
          id: lesson.id,
          title: lesson.title,
          poster: lesson.poster?.url,
          categories: lesson.categories.map((x) => x.title),
          tags: lesson.tags.map((x) => x.title),
          technologies: lesson.technologies.map((x) => x.title),
        },
      ]);

      return lesson;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAllWithoutPayload(skip = 0, params: FilterFullLessonParams) {
    const where: Prisma.LessonWhereInput = {};

    if (params.categoryId) {
      where.categories = { some: { id: params.categoryId } };
    }

    if (params.tagId) {
      where.tags = { some: { id: params.tagId } };
    }

    if (params.isNew) {
      where.createdAt = {
        gte: moment().startOf('month').format(),
        lt: moment().endOf('month').format(),
      };
    }

    try {
      if (params.search) {
        const { hits, nbHits } = await this.meili.lessonsIndex.search(
          params.search,
          {
            filter: [
              params.categoryId ? `categories=${params.categoryId}` : '',
              params.tagId ? `tags=${params.tagId}` : '',
            ],
            offset: skip,
            limit: 10,
          },
        );

        where.id = { in: hits.map((x) => x.id) };

        const data = await this.prisma.lesson.findMany({
          where,
          orderBy: {
            id: 'desc',
          },
          select: getMany,
        });

        return {
          data,
          count: nbHits,
        };
      }

      const [data, count] = await this.prisma.$transaction([
        this.prisma.lesson.findMany({
          where,
          skip,
          take: 10,
          orderBy: {
            id: 'desc',
          },
          select: getMany,
        }),
        this.prisma.lesson.count({
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

  async findAll(skip = 0, payload: JWTPayload, params: FilterFullLessonParams) {
    const where: Prisma.LessonWhereInput = {};

    if (params.isFavourites) {
      where.favourites = { some: { id: payload.userId } };
    }

    if (params.isDownloads) {
      where.downloads = { some: { id: payload.userId } };
    }

    if (params.categoryId) {
      where.categories = { some: { id: params.categoryId } };
    }

    if (params.tagId) {
      where.tags = { some: { id: params.tagId } };
    }

    if (params.technologyId) {
      where.technologies = { some: { id: params.technologyId } };
    }

    if (params.isNew) {
      where.createdAt = {
        gte: moment().startOf('month').format(),
        lt: moment().endOf('month').format(),
      };
    }

    try {
      if (params.search) {
        const { hits, nbHits } = await this.meili.lessonsIndex.search(
          params.search,
          {
            filter: [
              params.categoryId ? `categories=${params.categoryId}` : '',
              params.tagId ? `tags=${params.tagId}` : '',
            ].filter((x) => x),
            offset: skip,
            limit: 10,
          },
        );

        where.id = { in: hits.map((x) => x.id) };

        const data = await this.prisma.lesson.findMany({
          where,
          orderBy: {
            id: 'desc',
          },
          select: {
            ...getMany,
            favourites: { where: { id: payload.userId }, select: { id: true } },
          },
        });

        return {
          data,
          count: nbHits,
        };
      }

      const [data, count] = await this.prisma.$transaction([
        this.prisma.lesson.findMany({
          where,
          skip,
          take: 10,
          orderBy: {
            id: 'desc',
          },
          select: {
            ...getMany,
            favourites: { where: { id: payload.userId }, select: { id: true } },
          },
        }),
        this.prisma.lesson.count({
          where,
        }),
      ]);

      return {
        data: data.map((x: any) => {
          x.isFavourite = !!x.favourites.length;
          delete x.favourites;

          return x;
        }),
        count,
      };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findOne(id: number, withFile: boolean) {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id },
        select: {
          ...getOne,
          ...(withFile
            ? {
                file: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                },
              }
            : {}),
        },
      });

      if (!lesson) return Utils.ErrorHandler(404, null, 'Lesson not found');

      return lesson;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async download(id: number, payload: JWTPayload) {
    try {
      const [lesson, user] = await this.prisma.$transaction([
        this.prisma.lesson.findUnique({
          where: { id },
        }),
        this.prisma.user.findUnique({
          where: { id: payload.userId },
          include: { subscriptionType: true },
        }),
      ]);

      if (!lesson.fileId)
        return Utils.ErrorHandler(404, null, 'File not found');

      if (user.activeBefore.getTime() < new Date().getTime()) {
        console.log(user.activeBefore);

        return Utils.ErrorHandler(404, null, 'Update payment plan');
      }

      if (!user.subscriptionType) {
        console.log(user.subscriptionType);

        return Utils.ErrorHandler(404, null, 'Update payment plan');
      }

      if (user.subscriptionType?.downloadsPerDay <= user.todayDownloads)
        return Utils.ErrorHandler(404, null, "Download's limit exceeded");

      const [_, file] = await this.prisma.$transaction([
        this.prisma.lesson.update({
          where: { id: lesson.id },
          data: { downloads: { connect: { id: payload.userId } } },
        }),
        this.prisma.file.findUnique({
          where: { id: lesson.fileId },
        }),
        this.prisma.user.update({
          where: { id: payload.userId },
          data: { todayDownloads: { increment: 1 } },
        }),
      ]);

      return file;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async favourite(id: number, payload: JWTPayload) {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id },
        select: getOne,
      });

      if (!lesson) return Utils.ErrorHandler(404, null, 'Lesson not found');

      const [_, user] = await this.prisma.$transaction([
        this.prisma.lesson.update({
          where: { id: lesson.id },
          data: { favourites: { connect: { id: payload.userId } } },
        }),
        this.prisma.user.findUnique({
          where: { id: payload.userId },
          select: getOneUser,
        }),
      ]);

      return user;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateLessonDto) {
    const candidate = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!candidate) return Utils.ErrorHandler(404, null, 'Lesson not found');

    const data: Prisma.LessonUpdateInput = {};

    if (params.price && candidate.price !== params.price) {
      data.price = params.price;
    }

    if (params.title?.trim() && candidate.title !== params.title.trim()) {
      data.title = params.title.trim();
    }

    if (
      params.description?.trim() &&
      candidate.description !== params.description.trim()
    ) {
      data.description = params.description.trim();
    }

    if (params.posterId && candidate.posterId !== params.posterId) {
      data.poster = {
        connect: {
          id: params.posterId,
        },
      };
    }

    if (params.fileId && candidate.fileId !== params.fileId) {
      data.file = {
        connect: {
          id: params.fileId,
        },
      };
    }

    if (params.categories?.length) {
      data.categories = {
        set: [],
        connect: params.categories.map((id) => ({ id })),
      };
    }

    if (params.tags?.length) {
      data.tags = {
        set: [],
        connect: params.tags.map((id) => ({ id })),
      };
    }

    if (params.technologies?.length) {
      data.technologies = {
        set: [],
        connect: params.technologies.map((id) => ({ id })),
      };
    }

    try {
      const lesson = await this.prisma.lesson.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (Object.keys(data).length) {
        await this.meili.lessonsIndex.updateDocuments([
          {
            id: lesson.id,
            title: lesson.title,
            poster: lesson.poster?.url,
            categories: lesson.categories.map((x) => x.title),
            tags: lesson.tags.map((x) => x.title),
            technologies: lesson.technologies.map((x) => x.title),
          },
        ]);

        const ids = [];

        if (data.poster && candidate.posterId) {
          ids.push(candidate.posterId);
        }

        if (data.file && candidate.fileId) {
          ids.push(candidate.fileId);
        }

        if (ids.length) {
          await api
            .post(`${this.config.get('fileServer')}/file/delete-many`, { ids })
            .catch((e) => this.logger.error(e));
        }
      }

      return lesson;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      const lesson = await this.prisma.lesson.delete({
        where: { id },
      });

      if (!lesson) {
        return Utils.ErrorHandler(404, null, 'Lesson not found');
      }

      const ids = [];

      if (lesson.posterId) ids.push(lesson.posterId);

      if (lesson.fileId) ids.push(lesson.fileId);

      if (ids.length) {
        await api
          .post(`${this.config.get('fileServer')}/file/delete-many`, { ids })
          .catch((e) => this.logger.error(e));
      }

      await this.meili.lessonsIndex.deleteDocument(lesson.id);

      return { status: 200, message: 'Lesson deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
