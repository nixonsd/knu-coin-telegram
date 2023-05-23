import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { IAppConfig } from '@shared/config';
import { TeacherScene } from '@telegram-bot/scenes';
import { ArrangementWizard, MintWizard } from '@telegram-bot/wizards';
import { sessionMiddleware } from '@telegram-bot/middlewares';
import { TelegramBotUpdate } from '@telegram-bot/telegram-bot.update';
import { KnuContractModule } from '@knu-contract/knu-contract.module';
import { ParticipateWizard } from './wizards/participate.wizard';

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
    KnuContractModule,
  ],
  providers: [
    TelegramBotUpdate,
    MintWizard,
    ArrangementWizard,
    ParticipateWizard,
    TeacherScene,
  ],
})
export class TelegramBotModule {}
