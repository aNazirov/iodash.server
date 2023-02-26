import { MeiliModule } from '@libs/meili';
import { PrismaModule } from '@libs/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { appConfiguration } from 'config/config';
import { AuthModule } from './modules/business/auth/auth.module';
import { BillingModule } from './modules/business/billing/billing.module';
import { CategoryModule } from './modules/business/category/category.module';
import { GlobalModule } from './modules/business/global/global.module';
import { LessonModule } from './modules/business/lesson/lesson.module';
import { PaymentModule } from './modules/business/payment/payment.module';
import { SubscriptionTypeModule } from './modules/business/subscription-type/subscription-type.module';
import { TagModule } from './modules/business/tag/tag.module';
import { UserModule } from './modules/business/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfiguration] }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MeiliModule,
    AuthModule,
    PaymentModule,
    CategoryModule,
    TagModule,
    BillingModule,
    SubscriptionTypeModule,
    GlobalModule,
    UserModule,
    LessonModule,
    // CacheModule.register({
    //   isGlobal: true,
    //   store: RedisStore,
    //   host: appConfiguration().redis.host,
    //   port: appConfiguration().redis.port,
    // }),
    // IORedisModule,
  ],
})
export class AppModule {}
