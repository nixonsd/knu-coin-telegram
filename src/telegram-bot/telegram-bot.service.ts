import { Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
export class TelegramBotService {
  @Hears('hi')
  async hears() {
    return 'Hello World';
  }

  @On('message')
  async message(@Ctx() ctx: Context) {
    await ctx.reply('Message', Markup.keyboard([ [ '1', '2', '3' ], [ '4', '5', '6' ] ]));
  }
}
