import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('pay')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createPayment(@Body() body: { email: string; userId: string }) {
    const { email, userId } = body;
    return this.stripeService.createPayment(email, userId);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    return this.stripeService.handleWebhook(req, res);
  }
}
