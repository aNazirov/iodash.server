import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Enums, Utils } from 'src/modules/helpers';
import { JWTPayload } from '../auth/dto/auth.dto';
import { SubscriptionTypeService } from '../subscription-type/subscription-type.service';
import { CreateUserDto, FilterUserParams, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

export const getOne = {
  id: true,
  name: true,
  role: {
    select: {
      id: true,
      title: true,
    },
  },
  contact: { select: { email: true } },
  balance: true,
  activeBefore: true,
  _count: {
    select: {
      downloads: true,
      favourites: true,
      views: true,
    },
  },
  subscriptionType: {
    select: {
      id: true,
      title: true,
      description: true,
      months: true,
      price: true,
      downloadsPerDay: true,
    },
  },
  avatar: {
    select: {
      id: true,
      name: true,
      url: true,
    },
  },
};

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    private readonly prisma: PrismaService,
    private readonly meili: MeiliService,
    private readonly rate: SubscriptionTypeService,
  ) {}

  async create(params: CreateUserDto, payload: JWTPayload): Promise<User> {
    const [email] = await this.prisma.$transaction([
      this.prisma.contact.findUnique({
        where: { email: params.email },
      }),
    ]);

    if (email)
      return Utils.ErrorHandler(409, null, `${params.email} already in use`);

    if (payload.role.id > params.roleId) {
      return Utils.ErrorHandler(
        403,
        null,
        'Вы не можете назначить данную роль',
      );
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name: params.name.trim(),
          role: { connect: { id: params.roleId } },
          balance: params.balance,
          contact: {
            create: {
              email: params.email,
            },
          },
          activeBefore: params.activeBefore
            ? new Date(params.activeBefore)
            : undefined,
          password: await bcrypt.hash(params.password, 12),
        },
        select: getOne,
      });

      await this.meili.usersIndex.addDocuments([
        {
          id: user.id,
          name: user.name,
          email: user.contact.email,
        },
      ]);

      return user;
    } catch (e) {
      return Utils.ErrorHandler(500, null, e);
    }
  }

  async findAll(skip = 0, payload: JWTPayload, params: FilterUserParams) {
    const where: Prisma.UserWhereInput = {};

    if (params.active) {
      where.activeBefore = {
        gte: new Date(),
      };
    }

    where.id = {
      not: payload.userId,
    };

    where.roleId = {
      gt: payload.role.id,
    };

    if (params.search) {
      const { hits, nbHits } = await this.meili.usersIndex.search(
        params.search,
        {
          offset: skip,
          limit: 10,
        },
      );

      const ids = hits
        .filter((x) => x.name.toLowerCase().includes(x.name.toLowerCase()))
        .map((x) => x.id);

      where.id = { in: ids };

      const [data] = await this.prisma.$transaction([
        this.prisma.user.findMany({
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

    try {
      const [data, count] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          skip,
          take: 10,
          orderBy: {
            id: 'desc',
          },
          select: getOne,
        }),
        this.prisma.user.count({
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

  async findOne(id: number, payload: JWTPayload) {
    try {
      const user = this.prisma.user.findUnique({
        where: { id },
        select: getOne,
      });

      if (!user) return Utils.ErrorHandler(404, null, 'User not found');

      return user;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findByToken(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: getOne,
      });

      if (!user) return Utils.ErrorHandler(404, null, `User not found`);

      return user;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(
    id: number,
    params: UpdateUserDto,
    payload: JWTPayload,
  ): Promise<User> {
    const candidate = await this.prisma.user.findUnique({
      where: {
        ...(payload.role.id === Enums.RoleType.User
          ? { id: payload.userId }
          : { id }),
      },
      include: { contact: { select: { email: true } } },
    });

    if (!candidate) return Utils.ErrorHandler(404, null, `User not found`);

    const data: Prisma.UserUpdateInput = {};

    if (params.email && candidate.contact.email !== params.email) {
      const contact = await this.prisma.contact.findUnique({
        where: { email: params.email },
      });

      if (contact)
        return Utils.ErrorHandler(409, null, `${params.email} already in use`);

      data.contact = { update: { email: params.email } };
    }

    if (params.roleId && candidate.roleId !== params.roleId) {
      if (payload.role.id > params.roleId) {
        return Utils.ErrorHandler(403, null, 'You can not assign this role');
      }

      data.role = { connect: { id: params.roleId } };
    }

    if (params.avatarId && candidate.avatarId !== params.avatarId) {
      if (payload.role.id > params.roleId) {
        return Utils.ErrorHandler(403, null, 'You can not assign this role');
      }

      data.avatar = { connect: { id: params.avatarId } };
    }

    if (params.name.trim() && candidate.name !== params.name.trim()) {
      data.name = params.name.trim();
    }

    if (params.balance && candidate.balance !== params.balance) {
      data.balance = params.balance;
    }

    if (
      params.activeBefore &&
      candidate.activeBefore.getTime() !==
        new Date(params.activeBefore).getTime()
    ) {
      data.activeBefore = new Date(params.activeBefore);
    }

    if (params.password) {
      const equals = await bcrypt.compare(params.password, candidate.password);

      if (!equals) data.password = await bcrypt.hash(params.password, 12);
    }

    if (params.rate && candidate.subscriptionTypeId !== params.rate) {
      await this.rate.subscribe(params.rate, payload);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (data.name || data.contact) {
        await this.meili.usersIndex.updateDocuments([
          {
            id: user.id,
            name: user.name,
            email: user.contact.email,
          },
        ]);
      }

      return user;
    } catch (e) {
      return Utils.ErrorHandler(500, null, e);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });

      if (!user) return Utils.ErrorHandler(404);

      await this.meili.usersIndex.deleteDocument(user.id);

      return { status: 200, message: 'User deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          roleId: Enums.RoleType.User,
          balance: {
            gte: 0,
          },
          activeBefore: {
            gte: new Date(),
          },
        },
        include: { subscriptionType: true },
      });

      await Promise.all(
        users.map(async (user) => {
          if (user.balance > user.subscriptionType.price) {
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                balance: { decrement: user.subscriptionType.price },
                activeBefore: moment()
                  .add('months', user.subscriptionType.months)
                  .format(),
              },
            });
          }
        }),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
