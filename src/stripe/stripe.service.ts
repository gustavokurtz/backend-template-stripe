import { Injectable } from '@nestjs/common';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private endpointSecret: string;
  private prisma = new PrismaClient();

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!secretKey || !webhookSecret) {
      throw new Error('Stripe keys are not defined in environment variables');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });

    this.endpointSecret = webhookSecret;
  }

  async createPayment(userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: 'Produto teste' },
            unit_amount: 6700,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/sucess',
      cancel_url: 'http://localhost:3001/register',
      metadata: {
        userId,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(req: express.Request, res: express.Response) {
    let event: Stripe.Event;
    const sig = req.headers['stripe-signature'];

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        this.endpointSecret,
      );
    } catch (err) {
      console.error(`❌ Webhook signature error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) break;

        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (user && !user.isPaid) {
          await this.prisma.user.update({
            where: { id: userId },
            data: { isPaid: true },
          });

          console.log(`✅ Usuário ${user.email} marcado como pago`);
        }

        break;
      }

      case 'payment_intent.succeeded': {
        break;
      }

      case 'payment_intent.payment_failed': {
        break;
      }

      default:
        break;
    }

    return res.status(200).send({ received: true });
  }
}
