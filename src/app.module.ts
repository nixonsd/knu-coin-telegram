import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from 'app.controller';
import { LoggerModule } from 'nestjs-pino';
import { API_VERSION } from './constants';
import { IAppConfig, getAppConfig } from './shared/config';
import { TelegramBotModule } from './telegram-bot';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ getAppConfig ],
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    TelegramBotModule,
  ],
  controllers: [ AppController ],
  providers: [
    {
      provide: API_VERSION,
      inject: [ ConfigService<IAppConfig> ],
      useFactory: (appConfig: ConfigService<IAppConfig>) => appConfig.get<string>('version'),
    },
  ],
})
export class AppModule {}
