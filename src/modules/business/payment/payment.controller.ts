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
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  create(
    @Body() params: CreatePaymentDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.paymentService.create(params, payload);
  }

  @Get()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  findAll(
    @Query('skip') skip: number,
    @JWTPayloadData() payload: JWTPayload,
    @Query('params') params: string,
  ) {
    return this.paymentService.findAll(+skip, payload, Utils.parse(params));
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.paymentService.findOne(+id, payload);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() params: UpdatePaymentDto,
    @JWTPayloadData() payload: JWTPayload,
  ) {
    return this.paymentService.update(+id, params, payload);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.paymentService.remove(+id, payload);
  }
}
