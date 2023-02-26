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
import {
  CreateSubscriptionTypeDto,
  UpdateSubscriptionTypeDto,
} from './dto/subscription-type.dto';
import { SubscriptionTypeService } from './subscription-type.service';

@Controller('subscription-type')
export class SubscriptionTypeController {
  constructor(
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() params: CreateSubscriptionTypeDto) {
    return this.subscriptionTypeService.create(params);
  }

  @Post('subscribe/:id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  subscribe(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.subscriptionTypeService.subscribe(+id, payload);
  }

  @Post('unsubscribe/:id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  unsubscribe(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.subscriptionTypeService.unsubscribe(+id, payload);
  }

  @Get()
  findAll(@Query('skip') skip: number, @Query('params') params: string) {
    return this.subscriptionTypeService.findAll(+skip, Utils.parse(params));
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.subscriptionTypeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() params: UpdateSubscriptionTypeDto) {
    return this.subscriptionTypeService.update(+id, params);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.subscriptionTypeService.remove(+id);
  }
}
