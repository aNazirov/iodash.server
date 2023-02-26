import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmptyObject, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class RegistrationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto extends OmitType(RegistrationDto, [
  'name',
  'email',
] as const) {
  @IsString()
  login: string;
}

export class AuthenticatedUser {
  @IsNotEmptyObject()
  user: User;

  @IsString()
  jwt: string;
}

export class JWTPayload {
  userId: number;
  email: string;
  role: { id: number; title: string };
}
