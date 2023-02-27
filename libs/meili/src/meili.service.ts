import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MeiliSearch, { Index } from 'meilisearch';

interface CategoryQueryModel {
  id: number;
  title: string;
}

interface TagQueryModel {
  id: number;
  title: string;
}

interface TechnologyQueryModel {
  id: number;
  title: string;
}

interface UserQueryModel {
  id: number;
  name: string;
  email: string;
}

interface LessonQueryModel {
  id: number;
  title: string;
  poster: string;
  categories: string[];
  tags: string[];
  technologies: string[];
}

@Injectable()
export class MeiliService implements OnModuleInit {
  private readonly logger = new Logger('MeiliService');
  constructor(private configService: ConfigService) {}

  client: MeiliSearch;
  categoriesIndex: Index<CategoryQueryModel>;
  tagsIndex: Index<TagQueryModel>;
  lessonsIndex: Index<LessonQueryModel>;
  usersIndex: Index<UserQueryModel>;
  technologiesIndex: Index<TechnologyQueryModel>;

  async onModuleInit() {
    this.client = new MeiliSearch({
      host: this.configService.get('meili').host,
      apiKey: this.configService.get('meili').key,
    });

    this.categoriesIndex = this.client.index('categories');
    this.tagsIndex = this.client.index('tags');
    this.lessonsIndex = this.client.index('lessons');
    this.usersIndex = this.client.index('users');
    this.technologiesIndex = this.client.index('technologies');

    this.logger.log('Meilisearch connected', this.client.config.host);
  }
}
