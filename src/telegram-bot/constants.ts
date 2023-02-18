import { Markup } from 'telegraf';

export const BOT_MAIN_KEYBOARD = [
  [ Markup.button.callback('Send Coins 🚀', 'test'), 'Receive Coins' ],
  [ 'Balance 💰' ],
];

export const START_MESSAGE = '\
This bot was developed for entertainment purposes\\.\
Use code and *KNUCoin* 🤖 on your own decision\\. \
_The developer is not responsible for illegal actions of users\\._ \
Use /help ℹ️ for more info\\. \
';

export const HELP_MESSAGE = '\
The bot was developed by Bohdan Kiselov 2023\\.\n\
[GitHub Telegram Bot 🤖](https://github.com/nixonsd/knu-coin-telegram) \n\
[GitHub Contract 🚀](https://github.com/nixonsd/knu-coin-contract)\
';
