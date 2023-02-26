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
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() params: CreateLessonDto) {
    return this.lessonService.create(params);
  }

  @Get('shorts')
  findAllFullInfo(
    @Query('skip') skip: number,
    @Query('params') params: string,
  ) {
    return this.lessonService.findAllWithoutPayload(+skip, Utils.parse(params));
  }

  @Get()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(
    @Query('skip') skip: number,
    @JWTPayloadData() payload: JWTPayload,
    @Query('params') params: any,
  ) {
    return this.lessonService.findAll(+skip, payload, Utils.parse(params));
  }

  @Get('download/:id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  download(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    console.log(id);

    return this.lessonService.download(+id, payload);
  }

  @Post('favourite/:id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  favourite(@Param('id') id: string, @JWTPayloadData() payload: JWTPayload) {
    return this.lessonService.favourite(+id, payload);
  }

  @Get('short/:id')
  findOneWithoutFile(@Param('id') id: string) {
    return this.lessonService.findOne(+id, false);
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id, true);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() params: UpdateLessonDto) {
    return this.lessonService.update(+id, params);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
