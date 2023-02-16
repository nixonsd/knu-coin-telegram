import { IAppConfig } from '@/shared/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TELEGRAM_API_KEY } from './constants';
import { TelegramBotService } from './telegram-bot.service';

/**
 * Module responsible for interacting with telegram bot
 */
@Module({
  providers: [
    {
      provide: TELEGRAM_API_KEY,
      inject: [ ConfigService<IAppConfig> ],
      useFactory: (appConfig: ConfigService<IAppConfig>) => appConfig.get<IAppConfig>('telegramApiKey'),
    },
    TelegramBotService,
  ],
})
export class TelegramBotModule {}
