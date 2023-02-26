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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  create(@Body() params: CreateCategoryDto) {
    return this.categoryService.create(params);
  }

  @Get()
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  findAll(
    @JWTPayloadData() payload: JWTPayload,
    @Query('skip') skip?: string,
    @Query('params') params?: string,
  ) {
    return this.categoryService.findAll(+skip, payload, Utils.parse(params));
  }

  @Get(':id')
  @Roles(Enums.RoleType.Admin, Enums.RoleType.User)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() params: UpdateCategoryDto) {
    return this.categoryService.update(+id, params);
  }

  @Delete(':id')
  @Roles(Enums.RoleType.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
