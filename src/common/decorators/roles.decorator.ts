import { SetMetadata } from '@nestjs/common';
import { Enums } from 'src/modules/helpers';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Enums.RoleType[]) =>
  SetMetadata(ROLES_KEY, roles);
