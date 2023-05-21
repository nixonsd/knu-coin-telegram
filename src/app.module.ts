import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { API_VERSION } from './constants';
import { AppController } from 'app.controller';
import { IAppConfig, getAppConfig } from '@shared/config';
import { TelegramBotModule } from '@telegram-bot/telegram-bot.module';

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
