import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Scenes.SceneContext>();

    await ctx.replyWithHTML(`<b>Помилка</b>: ${exception.message}`);
    await ctx.scene.reenter();
  }
}
