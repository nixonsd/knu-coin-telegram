import { IAppConfig } from '@shared/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TeacherScene } from '@telegram-bot/scenes';
import { MintWizard } from '@telegram-bot/wizards';
import { sessionMiddleware } from '@telegram-bot/middlewares';
import { TelegramBotUpdate } from '@telegram-bot/telegram-bot.update';
import { KNUCoinContractModule } from '@knu-coin-contract/knu-coin-contract.module';

/**
 * Module responsible for interacting with telegram bot
 */
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ ConfigService<IAppConfig> ],
      useFactory: (appConfig: ConfigService<IAppConfig>) => ({
        token: appConfig.get<string>('telegramApiKey') as string,
        middlewares: [ sessionMiddleware ],
      }),
    }),
    KNUCoinContractModule,
  ],
  providers: [
    TelegramBotUpdate,
    MintWizard,
    TeacherScene,
  ],
})
export class TelegramBotModule {}
