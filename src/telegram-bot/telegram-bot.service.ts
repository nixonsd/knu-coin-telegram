import { Inject, Injectable } from '@nestjs/common';
import { logger } from '@shared/logger';

import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_API_KEY } from './constants';

@Injectable()
export class TelegramBotService {
  private telegramBot: TelegramBot;

  constructor(@Inject(TELEGRAM_API_KEY) telegramApiKey: string) {
    this.telegramBot = new TelegramBot(telegramApiKey, { polling: true });
    this.telegramBot.on('message', (message) => { logger.debug(message); });
  }
}
