import { Controller, Get, Query } from '@nestjs/common';
import { MeiliSearchDto } from './dto/where.dto';
import { GlobalService } from './global.service';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get('autoComplete')
  meiliSearch(@Query() queries: MeiliSearchDto) {
    return this.globalService.meiliSearch(queries);
  }

  @Get('main')
  lessons() {
    return this.globalService.main();
  }
}
