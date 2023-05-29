import { Command, Ctx, Hears, Help, InjectBot, Sender, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from './interfaces';
import { TeacherGuard } from './guards';
import { defaultKeyboard } from './utils';
import { TelegrafExceptionFilter } from './filters';
import { UseFilters, UseGuards } from '@nestjs/common';
import { KnuContractService } from '@knu-contract/knu-contract.service';
import { ALL_COMMANDS, HELP_MESSAGE, PARTICIPATE_WIZARD, START_MESSAGE, TEACHER_SCENE } from './constants';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class TelegramBotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly knuContractService: KnuContractService,
  ) {
    this.bot.telegram.setMyCommands(ALL_COMMANDS);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await defaultKeyboard(ctx, START_MESSAGE);
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdownV2(HELP_MESSAGE);
  }

  @Hears('Взяти участь в події 🎟️')
  async participateArrangement(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(PARTICIPATE_WIZARD, {}, true);
    await ctx.scene.reenter();
  }

  @Hears('Отримати винагороду 🌟')
  @Hears('Обмін балансу на призи 🧸')
  async getReward(@Ctx() ctx: Context, @Sender('id') userId: string): Promise<void> {
    await ctx.replyWithHTML(`Ваш ідентифікатор користувача: <b><code>${userId}</code></b>. Вкажіть цей код Вашому вчителю`);
  }

  @Hears('Баланс 💰')
  async balance(@Sender('id') userId: number): Promise<string> {
    const balance = await this.knuContractService.balanceOf(userId);

    return `Ваш баланс: ${ balance }KNU`;
  }

  @Command('teacher')
  @UseGuards(TeacherGuard)
  async onTeacherCommand(ctx: Context): Promise<void> {
    await ctx.scene.enter(TEACHER_SCENE);
  }

  // ! ПРОДУМАТИ ОБМІН ГРОШЕЙ НА ПРИЗИ Й РЕАЛІЗУВАТИ ЦЕ
}
