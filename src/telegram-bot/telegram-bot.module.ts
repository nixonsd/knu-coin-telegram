import { IAppConfig } from '@/shared/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramBotService } from './telegram-bot.service';

/**
 * Module responsible for interacting with telegram bot
 */
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ ConfigService<IAppConfig> ],
      useFactory: (appConfig: ConfigService<IAppConfig>) => ({
        token: appConfig.get<string>('telegramApiKey') as string,
        launchOptions: {
          dropPendingUpdates: false,
        },
      }),
    }),
  ],
  providers: [
    TelegramBotService,
  ],
})
export class TelegramBotModule {}
