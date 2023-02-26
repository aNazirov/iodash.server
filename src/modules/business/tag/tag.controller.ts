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
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Enums, Utils } from 'src/modules/helpers';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateTagDto) {
    return this.tagService.create(params);
  }

  @Get()
  findAll(@Query('skip') skip: number, @Query('params') params: string) {
    return this.tagService.findAll(+skip, Utils.parse(params));
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() params: UpdateTagDto) {
    return this.tagService.update(+id, params);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
