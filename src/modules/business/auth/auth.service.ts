import { MeiliService } from '@libs/meili';
import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { appConfiguration } from 'config/config';
import { Enums, Utils } from 'src/modules/helpers';
import { User } from '../user/entities/user.entity';
import { getOne as getOneUser } from '../user/user.service';
import { AuthenticatedUser, LoginDto, RegistrationDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly meili: MeiliService,
  ) {}

  async validateUser(params: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        contact: { OR: [{ email: params.login }] },
      },
      select: { ...getOneUser, password: true },
    });

    if (user == null) return null;

    if (await bcrypt.compare(params.password, user.password)) return user;
  }

  async getToken(user: User) {
    return this.jwtService.sign(
      {
        uId: user.id,
        eId: user.contact.email,
        aat: user.activeBefore.getTime(),
      },
      {
        secret: appConfiguration().jwtSecret,
      },
    );
  }

  async authentication(params: LoginDto): Promise<AuthenticatedUser> {
    const user = await this.validateUser(params);

    if (!user) {
      return Utils.ErrorHandler(400, null, 'Incorrect login or password');
    }

    const jwt = await this.getToken(user);

    delete user.password;

    return {
      jwt,
      user,
    };
  }

  async registration(params: RegistrationDto): Promise<AuthenticatedUser> {
    const [email] = await this.prisma.$transaction([
      this.prisma.contact.findUnique({
        where: { email: params.email },
      }),
    ]);

    if (email)
      return Utils.ErrorHandler(409, null, `${params.email} already in use`);

    const user = await this.prisma.user.create({
      data: {
        name: params.name.trim(),
        contact: { create: { email: params.email } },
        password: await bcrypt.hash(params.password, 12),
        role: { connect: { id: Enums.RoleType.User } },
      },
      select: getOneUser,
    });

    await this.meili.usersIndex.addDocuments([
      {
        id: user.id,
        name: user.name,
        email: user.contact.email,
      },
    ]);

    const jwt = await this.getToken(user);

    return {
      jwt,
      user,
    };
  }
}
