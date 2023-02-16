import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureAppMiddleware } from 'configure-middleware';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { getAppConfig } from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = getAppConfig();

  configureAppMiddleware(app);

  const { port, listenHost } = appConfig;

  if (listenHost) {
    await app.listen(port, listenHost);
  } else {
    await app.listen(port);
  }

  app.get(Logger).log(`Server is running at ${listenHost || 'localhost'}:${port} 🚀`, 'NestApplication');
}

bootstrap();
