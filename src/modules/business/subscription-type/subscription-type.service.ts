import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';
import { Utils } from 'src/modules/helpers';
import { JWTPayload } from '../auth/dto/auth.dto';
import {
  CreateSubscriptionTypeDto,
  FindAllSubscriptionsDto,
  UpdateSubscriptionTypeDto,
} from './dto/subscription-type.dto';

export const getOne = {
  id: true,
  title: true,
  description: true,
  months: true,
  price: true,
  downloadsPerDay: true,
};

export const getAll = {
  id: true,
  title: true,
  description: true,
  months: true,
  price: true,
  downloadsPerDay: true,
};

@Injectable()
export class SubscriptionTypeService {
  private readonly logger = new Logger('SubscriptionTypeService');

  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateSubscriptionTypeDto) {
    if (!params.title?.trim()) {
      return Utils.ErrorHandler(400, null, 'Title must not be empty');
    }

    try {
      const subscriptionType = await this.prisma.subscriptionType.create({
        data: {
          title: params.title,
          ...(params.description
            ? {
                description: params.description,
              }
            : {}),
          price: params.price,
          months: params.months,
          downloadsPerDay: params.downloadsPerDay,
        },
        select: getOne,
      });

      return subscriptionType;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async subscribe(id: number, payload: JWTPayload) {
    try {
      const subscriptionType = await this.prisma.subscriptionType.findUnique({
        where: { id },
        select: getOne,
      });

      if (!subscriptionType)
        return Utils.ErrorHandler(404, null, 'Subscription not found');

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user.balance < subscriptionType.price) {
        return Utils.ErrorHandler(400, null, 'Balance not enough');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: subscriptionType.price },
          activeBefore: moment().add(subscriptionType.months, 'M').format(),
          subscriptionType: { connect: { id: subscriptionType.id } },
        },
      });

      return subscriptionType;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async unsubscribe(id: number, payload: JWTPayload) {
    try {
      const subscriptionType = await this.prisma.subscriptionType.findUnique({
        where: { id },
        select: getOne,
      });

      if (!subscriptionType)
        return Utils.ErrorHandler(404, null, 'Subscription not found');

      await this.prisma.user.update({
        where: { id: payload.userId },
        data: {
          subscriptionType: { disconnect: true },
        },
      });

      return subscriptionType;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0, params: FindAllSubscriptionsDto) {
    const where: Prisma.SubscriptionTypeWhereInput = {};

    const [data, count] = await this.prisma.$transaction([
      this.prisma.subscriptionType.findMany({
        where,
        select: getAll,
        skip,
        orderBy: {
          id: 'desc',
        },
        take: 15,
      }),
      this.prisma.subscriptionType.count({ where }),
    ]);

    return {
      data,
      count,
    };
  }

  async findOne(id: number) {
    try {
      const subscriptionType = await this.prisma.subscriptionType.findUnique({
        where: { id },
        select: getOne,
      });

      if (!subscriptionType)
        return Utils.ErrorHandler(404, null, 'Subscription not found');

      return subscriptionType;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(id: number, params: UpdateSubscriptionTypeDto) {
    const candidate = await this.prisma.subscriptionType.findUnique({
      where: { id },
    });

    if (!candidate)
      return Utils.ErrorHandler(404, null, `Subscription not found`);

    const data: Prisma.SubscriptionTypeUpdateInput = {};

    if (params.title?.trim() && candidate.title !== params.title.trim()) {
      data.title = params.title.trim();
    }

    if (
      params.description?.trim() &&
      candidate.description !== params.description.trim()
    ) {
      data.description = params.description.trim();
    }

    if (params.price && candidate.price !== params.price) {
      data.price = params.price;
    }

    if (params.months && candidate.months !== params.months) {
      data.months = params.months;
    }

    if (
      params.downloadsPerDay &&
      candidate.downloadsPerDay !== params.downloadsPerDay
    ) {
      data.downloadsPerDay = params.downloadsPerDay;
    }

    try {
      const subscriptionType = await this.prisma.subscriptionType.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      return subscriptionType;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number) {
    try {
      const subscriptionType = await this.prisma.subscriptionType.delete({
        where: { id },
      });

      if (!subscriptionType) {
        return Utils.ErrorHandler(404, null, 'Subscription not found');
      }

      return { status: 200, message: 'Subscription deleted' };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
