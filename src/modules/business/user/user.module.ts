import { Module } from '@nestjs/common';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SubscriptionTypeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
