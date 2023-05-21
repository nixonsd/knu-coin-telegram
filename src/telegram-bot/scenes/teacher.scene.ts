import { Markup, Telegraf } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Message } from 'telegraf/typings/core/types/typegram';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { Command, Ctx, Hears, InjectBot, On, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { Context } from '@telegram-bot/interfaces';
import { TeacherGuard } from '@telegram-bot/guards';
import { TelegrafExceptionFilter } from '@telegram-bot/filters';
import { defaultKeyboard, validate } from '@telegram-bot/utils';
import { ARRANGEMENT_WIZARD, BOT_TEACHER_KEYBOARD, MINT_WIZARD, TEACHER_COMMANDS, TEACHER_SCENE } from '@telegram-bot/constants';
import { KNUCoinContractService } from '@knu-coin-contract/knu-coin-contract.service';

enum SceneState {
  MAIN_MENU = 'MAIN_MENU',
  REWARD_USER = 'REWARD_USER',
  ARRANGEMENT_CREATION = 'ARRANGEMENT_CREATION',
}

enum ArrangementState {
  READY_TO_READ = 'READY_TO_READ',
  READING_REWARD = 'READING_REWARD',
}

enum RewardState {
  READY_TO_READ = 'READY_TO_READ',
  READING_USER_ID = 'READING_USER_ID',
  READING_AMOUNT = 'READING_AMOUNT',
}

type State = {
  state: SceneState;
  rewardUser: RewardUser;
  arrangementCreation: ArrangementCreation;
  [key: string]: unknown;
};

class ArrangementCreation {
  @IsEnum(ArrangementState)
  public state!: ArrangementState;

  @IsNumber()
  @IsPositive()
  public reward!: number;
}

class RewardUser {
  @IsEnum(RewardState)
  public state!: RewardState;

  @IsNumber()
  @IsPositive()
  public userId?: number;

  @IsNumber()
  @IsPositive()
  public amount?: number;
}

@Scene(TEACHER_SCENE)
@UseGuards(TeacherGuard)
@UseFilters(TelegrafExceptionFilter)
export class TeacherScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly knuCoinContractService: KNUCoinContractService,
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
    ctx.scene.session.state = undefined;
  }

  @Hears('Мої події 📅')
  async onMyArrangementsMessage(@Ctx() ctx: Context, @Sender('id') issuer: number): Promise<void> {
    await ctx.replyWithHTML(`${await this.knuCoinContractService.getArrangements(issuer)}`);
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
    await this.knuCoinContractService.mint(issuer, Number(userId), Number(amount));

    return `Користувачу відправлено ${amount}KNU`;
  }

  @Command('leave')
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }

  @On('text')
  async onText(ctx: Context) {
    if (ctx.scene.session.state) {
      const state = ctx.scene.session.state as State;
      await this.textHandler(ctx, state);
    }
  }

  private async textHandler(ctx: Context, state: State) {
    const text = (ctx.message as Message.TextMessage).text;
    switch(state.state) {
    case SceneState.REWARD_USER:
      // await this.onRewardUser(ctx, state.rewardUser, text);
      break;
    case SceneState.ARRANGEMENT_CREATION:
      await this.onArrangementCreation(ctx, state.arrangementCreation, text);
      break;
    }
  }

  private async onArrangementCreation(ctx: Context, arrangementCreation: ArrangementCreation, text: string): Promise<void> {
    switch (arrangementCreation.state) {
    case ArrangementState.READY_TO_READ:
      await ctx.replyWithHTML('Введіть нагороду для кожного учасника, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', Markup.keyboard([ 'Назад 🚪' ]));

      arrangementCreation.state = ArrangementState.READING_REWARD;

      break;
    case ArrangementState.READING_REWARD:
      arrangementCreation.reward = Number(text);

      validate<ArrangementCreation>(arrangementCreation, ArrangementCreation);

      await this.knuCoinContractService.createArrangement(ctx.message?.from.id as number, Number(arrangementCreation.reward));
      await ctx.replyWithHTML(`Створено подію з сумою винагороди ${arrangementCreation.reward}KNU`, Markup.keyboard(BOT_TEACHER_KEYBOARD).resize(true));

      ctx.scene.session.state = undefined;

      break;
    }
  }
}
