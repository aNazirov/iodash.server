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
import { CreateTechnologyDto, UpdateTechnologyDto } from './dto/technology.dto';
import { TechnologyService } from './technology.service';

@Controller('technology')
@UseGuards(JwtAuthGuard)
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateTechnologyDto) {
    return this.technologyService.create(params);
  }

  @Get()
  findAll(@Query('skip') skip: number, @Query('params') params: string) {
    return this.technologyService.findAll(+skip, Utils.parse(params));
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.technologyService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() params: UpdateTechnologyDto) {
    return this.technologyService.update(+id, params);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.technologyService.remove(+id);
  }
}
