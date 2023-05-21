import { Markup, Telegraf } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Command, Ctx, Hears, InjectBot, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { Context } from '@telegram-bot/interfaces';
import { TeacherGuard } from '@telegram-bot/guards';
import { TelegrafExceptionFilter } from '@telegram-bot/filters';
import { defaultKeyboard } from '@telegram-bot/utils';
import { ARRANGEMENT_WIZARD, BOT_TEACHER_KEYBOARD, MINT_WIZARD, TEACHER_COMMANDS, TEACHER_SCENE } from '@telegram-bot/constants';
import { KnuContractService } from '@/knu-contract/knu-contract.service';

@Scene(TEACHER_SCENE)
@UseGuards(TeacherGuard)
@UseFilters(TelegrafExceptionFilter)
export class TeacherScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly knuContractService: KnuContractService,
  ) {}

  @SceneEnter()
  async onSceneEnter(ctx: Context): Promise<void> {
    await ctx.replyWithHTML('Ви війшли в кімнату вчителя, доброго дня!', Markup.keyboard(BOT_TEACHER_KEYBOARD));
    await this.bot.telegram.setMyCommands(TEACHER_COMMANDS);
  }

  @SceneLeave()
  async onSceneLeave(ctx: Context): Promise<void> {
    await defaultKeyboard(ctx, 'Ви повернулися в головну кімнату');
  }

  @Hears('На головну 🚪')
  async onExitMessage(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }

  @Hears('Назад 🚪')
  async onBackButton(ctx: Context) {
    await ctx.replyWithHTML('Ви повернулися в кімнату вчителя', Markup.keyboard(BOT_TEACHER_KEYBOARD));
  }

  @Hears('Мої події 📅')
  async onMyArrangementsMessage(@Ctx() ctx: Context, @Sender('id') issuer: number): Promise<void> {
    await ctx.replyWithHTML(`${await this.knuContractService.getArrangements(issuer)}`);
  }

  @Hears('Створити подію ➕')
  async onArrangementMessage(ctx: Context): Promise<void> {
    await ctx.scene.enter(ARRANGEMENT_WIZARD, {}, true);
    await ctx.scene.reenter();
  }

  @Hears('Нагородити учасника 💰')
  async onMintMessage(ctx: Context): Promise<void> {
    await ctx.scene.enter(MINT_WIZARD, {}, true);
    await ctx.scene.reenter();
  }

  @Command('add')
  async onAddCommand(@Ctx() ctx: Context, @Sender('id') issuer: number): Promise<string> {
    const [ , userId, amount ] = (ctx.message as Message.TextMessage).text.split(' ');
    await this.knuContractService.mint(issuer, Number(userId), Number(amount));

    return `Користувачу відправлено ${amount}KNU`;
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
