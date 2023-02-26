import { Module } from '@nestjs/common';
import { SubscriptionTypeController } from './subscription-type.controller';
import { SubscriptionTypeService } from './subscription-type.service';

@Module({
  controllers: [SubscriptionTypeController],
  providers: [SubscriptionTypeService],
  exports: [SubscriptionTypeService],
})
export class SubscriptionTypeModule {}
