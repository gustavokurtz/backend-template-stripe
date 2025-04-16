import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService],
  controllers: [StripeController]
})
export class StripeModule {}
