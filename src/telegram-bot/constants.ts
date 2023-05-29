export const TEACHER_SCENE = 'TEACHER_SCENE';
export const MAIN_SCENE = 'MAIN_SCENE';
export const MINT_WIZARD = 'MINT_WIZARD';
export const ARRANGEMENT_WIZARD = 'ARRANGEMENT_WIZARD';
export const PARTICIPATE_WIZARD = 'PARTICIPATE_WIZARD';
export const REDEEM_WIZARD = 'REDEEM_WIZARD';

export const ALL_COMMANDS = [
  { command: 'start', description: 'Розпочати роботу з ботом' },
  { command: 'teacher', description: 'Зайти в кімнату вчителя' },
  { command: 'add', description: 'Додати нового вчителя' },
  { command: 'remove', description: 'Видалити права вчителя у користувача' },
  { command: 'back', description: 'Вийти' },
];

export const BOT_MAIN_KEYBOARD = [
  [ 'Взяти участь в події 🎟️', 'Отримати винагороду 🌟' ],
  [ 'Баланс 💰' ],
];

export const BOT_TEACHER_KEYBOARD = [
  [ 'Мої події 📅', 'Створити подію ➕' ],
  [ 'Нагородити учасника 💰', 'Списати з учасника ➖' ],
  [ 'На головну 🚪' ],
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
