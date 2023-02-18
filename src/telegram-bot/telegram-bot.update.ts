import { Ctx, Hears, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { BOT_MAIN_KEYBOARD, HELP_MESSAGE, START_MESSAGE } from './constants';

@Update()
export class TelegramBotUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf) {
    bot.action('test', (ctx) => {console.log(ctx);});
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdownV2(START_MESSAGE, Markup.keyboard(BOT_MAIN_KEYBOARD));
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdownV2(HELP_MESSAGE);
  }

  @Hears('Balance 💰')
  async hears() {
    return;
  }
}
