import { Markup, Telegraf } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Action, Command, Ctx, Hears, InjectBot, Message, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { Context } from '@telegram-bot/interfaces';
import { TeacherGuard } from '@telegram-bot/guards';
import { TelegrafExceptionFilter } from '@telegram-bot/filters';
import { defaultKeyboard } from '@telegram-bot/utils';
import { ALL_COMMANDS, ARRANGEMENT_WIZARD, BOT_TEACHER_KEYBOARD, MINT_WIZARD, TEACHER_COMMANDS, TEACHER_SCENE } from '@telegram-bot/constants';
import { KnuContractService } from '@knu-contract/knu-contract.service';

const arrangementInlineKeyboard = (arrangementId: number) =>  Markup.inlineKeyboard([
  Markup.button.callback('Завершити 🏁', `end:${arrangementId}`),
  Markup.button.callback('Видалити ❌', `remove:${arrangementId}`),
]);

const confirmRemovalKeyboard = (arrangementId: number) => Markup.inlineKeyboard([
  Markup.button.callback('Підтвердити', `confirm_removal:${arrangementId}`),
  Markup.button.callback('Відмінити', `cancel:${arrangementId}`),
]);

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
    await this.bot.telegram.setMyCommands(TEACHER_COMMANDS);
    await ctx.replyWithHTML('Ви війшли в кімнату вчителя, доброго дня!', Markup.keyboard(BOT_TEACHER_KEYBOARD));
  }

  @SceneLeave()
  async onSceneLeave(ctx: Context): Promise<void> {
    await this.bot.telegram.setMyCommands(ALL_COMMANDS);
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
    const arrangements = await this.knuContractService.getArrangements(issuer);
    arrangements.map(async (value) => {
      await ctx.replyWithHTML(`Подія з ідентифікатором <b>${value}</b>.`, arrangementInlineKeyboard(value));
    });
  }

  @Action(/^remove:[0-9]+$/)
  async onRemoveAction(@Ctx() ctx: Context): Promise<void> {
    const arrangementId: number = (ctx.callbackQuery as any).data.split(':')[1];
    await ctx.editMessageText('Ви впевнені, що бажаєте видалити цю подію?', confirmRemovalKeyboard(arrangementId));
  }

  @Action(/^cancel:[0-9]+$/)
  async onCancelAction(@Ctx() ctx: Context): Promise<void> {
    const arrangementId: number = (ctx.callbackQuery as any).data.split(':')[1];
    await ctx.editMessageText(`Подія з ідентифікатором <b>${arrangementId}</b>.`, arrangementInlineKeyboard(arrangementId));
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
  async onAddCommand(@Ctx() ctx: Context, @Sender('id') issuer: number, @Message('text') message: string): Promise<string> {
    const [ , userId, amount ] = message.split(' ');
    await this.knuContractService.mint(issuer, Number(userId), Number(amount));

    return `Користувачу відправлено ${amount}KNU`;
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
