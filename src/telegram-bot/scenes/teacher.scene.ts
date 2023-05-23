import { Markup, Telegraf } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Action, Command, Ctx, Hears, InjectBot, Message, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { Context } from '@telegram-bot/interfaces';
import { TeacherGuard } from '@telegram-bot/guards';
import { TelegrafExceptionFilter } from '@telegram-bot/filters';
import { defaultKeyboard } from '@telegram-bot/utils';
import { ARRANGEMENT_WIZARD, BOT_TEACHER_KEYBOARD, MINT_WIZARD, TEACHER_SCENE } from '@telegram-bot/constants';
import { KnuContractService } from '@knu-contract/knu-contract.service';

const arrangementInlineKeyboard = (arrangementId: number) =>  Markup.inlineKeyboard([
  Markup.button.callback('Завершити 🏁', `finish:${arrangementId}`),
  Markup.button.callback('Видалити ❌', `remove:${arrangementId}`),
]);

const confirmRemovalKeyboard = (arrangementId: number) => Markup.inlineKeyboard([
  Markup.button.callback('Підтвердити', `confirm_removal:${arrangementId}`),
  Markup.button.callback('Відмінити', `cancel:${arrangementId}`),
]);

const confirmFinishKeyboard = (arrangementId: number) => Markup.inlineKeyboard([
  Markup.button.callback('Підтвердити', `confirm_finish:${arrangementId}`),
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
    await ctx.replyWithHTML('Ви війшли в кімнату вчителя, доброго дня!', Markup.keyboard(BOT_TEACHER_KEYBOARD));
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
    const arrangements = await this.knuContractService.getArrangements(issuer);
    if (arrangements.length < 1) {
      await ctx.reply('Ви не маєте жодної створеної події!');
    }
    arrangements.map(async (arrangementId) => {
      const arrangement = await this.knuContractService.getArrangementData(arrangementId);
      await ctx.replyWithHTML(
        `Подія під назвою "${arrangement.name}" з ідентифікатором <b><code>${arrangementId}</code></b>. Винагорода за подію: ${arrangement.reward}<b>KNU</b>`,
        arrangementInlineKeyboard(arrangementId),
      );
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
    const arrangement = await this.knuContractService.getArrangementData(arrangementId);
    await ctx.editMessageText(
      `Подія під назвою "${arrangement.name}" з ідентифікатором <b><code>${arrangementId}</code></b>. Винагорода за подію: ${arrangement.reward}<b>KNU</b>`,
      { parse_mode: 'HTML',
        reply_markup: arrangementInlineKeyboard(arrangementId).reply_markup,
      },
    );
  }

  @Action(/^confirm_removal:[0-9]+$/)
  async onConfirmRemovalAction(@Ctx() ctx: Context, @Sender('id') issuer: number): Promise<void> {
    const arrangementId: number = (ctx.callbackQuery as any).data.split(':')[1];
    await this.knuContractService.removeArrangement(issuer, arrangementId);
    await ctx.deleteMessage();
  }

  @Action(/^finish:[0-9]+$/)
  async onFinishAction(@Ctx() ctx: Context): Promise<void> {
    const arrangementId: number = (ctx.callbackQuery as any).data.split(':')[1];
    await ctx.editMessageText('Ви впевнені, що бажаєте завершити цю подію?', confirmFinishKeyboard(arrangementId));
  }

  @Action(/^confirm_finish:[0-9]+$/)
  async onConfirmFinishAction(@Ctx() ctx: Context, @Sender('id') issuer: number): Promise<void> {
    const arrangementId: number = (ctx.callbackQuery as any).data.split(':')[1];
    await this.knuContractService.finishArrangement(issuer, arrangementId);
    await ctx.deleteMessage();
  }

  @Hears('Створити подію ➕')
  async onArrangementMessage(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(ARRANGEMENT_WIZARD, {}, true);
    await ctx.scene.reenter();
  }

  @Hears('Нагородити учасника 💰')
  async onMintMessage(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(MINT_WIZARD, {}, true);
    await ctx.scene.reenter();
  }

  @Command('add')
  async onAddCommand(@Ctx() ctx: Context, @Sender('id') issuer: number, @Message('text') message: string): Promise<void> {
    const [ , userId, amount ] = message.split(' ');
    await this.knuContractService.mint(issuer, Number(userId), Number(amount));
    await ctx.replyWithHTML(`Користувачу відправлено <b>${amount}KNU</b>`);
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
