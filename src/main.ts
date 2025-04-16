import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para permitir apenas o front-end
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, // se você precisar enviar cookies ou Authorization header
  });

  // Importante: para o webhook
  app.use('/pay/webhook', bodyParser.raw({ type: 'application/json' }));

  await app.listen(3000);
}
bootstrap();
