import { Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class TelegramBotService {
  @Hears('hi')
  async hears() {
    return 'Hello World';
  }

  @On('message')
  async message(@Ctx() ctx: Context) {
    await ctx.telegram.sendMessage(ctx.message?.chat.id as number, `Hello ${JSON.stringify(ctx.state)}`);
  }
}
