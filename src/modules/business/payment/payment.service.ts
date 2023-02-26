import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Enums, Utils } from 'src/modules/helpers';
import { JWTPayload } from '../auth/dto/auth.dto';
import { UserService } from '../user/user.service';
import {
  CreatePaymentDto,
  FilterPaymentParams,
  UpdatePaymentDto,
} from './dto/payment.dto';
import { Payment } from './entities/payment.entity';

const getOne = {
  id: true,
  type: {
    select: {
      id: true,
      title: true,
    },
  },
  status: {
    select: {
      id: true,
      title: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  summa: true,
  createdAt: true,
  perfermAt: true,
  updatedAt: true,
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async create(
    params: CreatePaymentDto,
    payload?: JWTPayload,
  ): Promise<Payment> {
    const user = await this.prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return Utils.ErrorHandler(404, null, `Пользователь не найден`);
    }

    try {
      const payment = await this.prisma.payment.create({
        data: {
          type: { connect: { id: params.typeId } },
          status: {
            connect: { id: params.statusId || Enums.PaymentStatusType.Pending },
          },
          user: { connect: { id: params.userId } },
          phone_number: params.phone_number,
          summa: params.summa,
          click_trans_id: params.click_trans_id,
          merchant_trans_id: params.merchant_trans_id,
          merchant_prepare_id: params.merchant_prepare_id,
          merchant_confirm_id: params.merchant_confirm_id,
        },
        select: getOne,
      });

      if (params.statusId === Enums.PaymentStatusType.Success) {
        await this.user.update(
          payment.user.id,
          {
            balance: user.balance + payment.summa,
          },
          payload,
        );
      }

      return payment;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async findAll(skip = 0, payload: JWTPayload, params: FilterPaymentParams) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.typeId) {
      where.typeId = params.typeId;
    }

    if (params.statusId) {
      where.statusId = params.statusId;
    }

    if (payload.role.id === Enums.RoleType.User) {
      where.userId = payload.userId;
    }

    try {
      const [data, count] = await this.prisma.$transaction([
        this.prisma.payment.findMany({
          where,
          skip,
          take: 10,
          orderBy: {
            id: 'desc',
          },
          select: getOne,
        }),
        this.prisma.payment.count({
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

  async findOne(id: number, payload: JWTPayload): Promise<Payment> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        select: getOne,
      });

      if (!payment) {
        return Utils.ErrorHandler(404, null, 'Платеж не найден');
      }

      return payment;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async update(
    id: number,
    params: UpdatePaymentDto,
    payload?: JWTPayload,
  ): Promise<Payment> {
    const candidate = await this.prisma.payment.findUnique({ where: { id } });

    if (!candidate) {
      return Utils.ErrorHandler(404, null, 'Платеж не найден');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: params.userId || candidate.userId },
    });

    const data: Prisma.PaymentUpdateInput = {};

    if (params.typeId && candidate.typeId !== params.typeId) {
      data.type = { connect: { id: params.typeId } };
    }

    if (params.statusId && candidate.statusId !== params.statusId) {
      data.status = { connect: { id: params.statusId } };
    }

    if (
      params.click_trans_id &&
      candidate.click_trans_id !== params.click_trans_id
    ) {
      data.click_trans_id = params.click_trans_id;
    }

    if (
      params.cancel_reason &&
      candidate.cancel_reason !== params.cancel_reason
    ) {
      data.cancel_reason = params.cancel_reason;
    }

    if (
      params.merchant_trans_id &&
      candidate.merchant_trans_id !== params.merchant_trans_id
    ) {
      data.merchant_trans_id = params.merchant_trans_id;
    }

    if (
      params.merchant_prepare_id &&
      candidate.merchant_prepare_id !== params.merchant_prepare_id
    ) {
      data.merchant_prepare_id = params.merchant_prepare_id;
    }

    if (
      params.merchant_confirm_id &&
      candidate.merchant_confirm_id !== params.merchant_confirm_id
    ) {
      data.merchant_confirm_id = params.merchant_confirm_id;
    }

    if (
      params.payme_transaction_id &&
      candidate.payme_transaction_id !== params.payme_transaction_id
    ) {
      data.payme_transaction_id = params.payme_transaction_id;
    }

    if (
      params.perfermAt &&
      candidate.perfermAt?.getTime() !== params.perfermAt
    ) {
      data.perfermAt = new Date(params.perfermAt);
    }

    try {
      const payment = await this.prisma.payment.update({
        where: { id: candidate.id },
        data,
        select: getOne,
      });

      if (data.status) {
        if (params.statusId === Enums.PaymentStatusType.Success) {
          await this.user.update(
            payment.user.id,
            {
              balance: user.balance + payment.summa,
            },
            payload,
          );
        } else if (
          params.statusId === Enums.PaymentStatusType.Fail &&
          candidate.statusId === Enums.PaymentStatusType.Success
        ) {
          await this.user.update(
            payment.user.id,
            {
              balance: user.balance - payment.summa,
            },
            payload,
          );
        }
      }

      return payment;
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }

  async remove(id: number, payload: JWTPayload) {
    try {
      const payment = await this.prisma.payment.delete({
        where: { id },
        include: { user: true },
      });

      if (!payment) {
        return Utils.ErrorHandler(404, null, 'Платеж не найден');
      }

      if (payment.statusId === Enums.PaymentStatusType.Success) {
        await this.user.update(
          payment.user.id,
          {
            balance: payment.user.balance - payment.summa,
          },
          payload,
        );
      }

      return {
        message: 'Платеж удален',
        status: 200,
      };
    } catch (e) {
      return Utils.ErrorHandler(500, e);
    }
  }
}
