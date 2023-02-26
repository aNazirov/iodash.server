import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { appConfiguration } from 'config/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Utils } from 'src/modules/helpers';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfiguration().jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate({ headers }: Request, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.uId },
      select: {
        role: { select: { id: true, title: true } },
      },
    });

    if (!user) return Utils.ErrorHandler(403);

    return {
      userId: payload.uId,
      email: payload.eId,
      activeBefore: payload.aat,
      role: { id: user.role.id, title: user.role.title },
    };
  }
}
