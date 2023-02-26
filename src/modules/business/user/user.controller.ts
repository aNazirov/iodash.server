import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard, JWTPayloadData } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Enums, Utils } from 'src/modules/helpers';
import { JWTPayload } from '../auth/dto/auth.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateUserDto, @JWTPayloadData() payload: JWTPayload) {
    return this.userService.create(params, payload);
  }

  @Get()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  findAll(
    @Query('skip') skip: number,
    @JWTPayloadData() payload: JWTPayload,
    @Query('params') params: string,
  ) {
    return this.userService.findAll(+skip, payload, Utils.parse(params));
  }

  @Get('token')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  findByToken(@JWTPayloadData() payload: JWTPayload) {
    return this.userService.findByToken(payload.userId);
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.userService.findOne(+id, payload);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() params: UpdateUserDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.userService.update(+id, params, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
