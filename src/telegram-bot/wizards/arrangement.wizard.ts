import { Command, Ctx, Hears, Message, Next, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { ARRANGEMENT_WIZARD, BOT_TEACHER_KEYBOARD, TEACHER_SCENE } from '@telegram-bot/constants';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TeacherGuard } from '@telegram-bot/guards';
import { TelegrafExceptionFilter } from '@telegram-bot/filters';
import { Markup, Scenes } from 'telegraf';
import { IsNumber, IsPositive } from 'class-validator';
import { validate } from '@telegram-bot/utils';
import { KnuContractService } from '@/knu-contract/knu-contract.service';

class Arrangement {
  @IsNumber()
  @IsPositive()
  public reward!: number;
}

const backKeyboard = Markup.keyboard([ 'Назад 🚪' ]).oneTime();
const teacherKeyboard = Markup.keyboard(BOT_TEACHER_KEYBOARD);

@Wizard(ARRANGEMENT_WIZARD)
@UseGuards(TeacherGuard)
@UseFilters(TelegrafExceptionFilter)
export class ArrangementWizard {
  constructor(private readonly knuContractService: KnuContractService) {}

  @WizardStep(1)
  async readReward(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть нагороду для кожного учасника, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async rewardHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Arrangement;
    state.reward = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }

  @WizardStep(3)
  async process(@Ctx() ctx: Scenes.WizardContext, @Sender('id') issuer: number) {
    const state = ctx.wizard.state as Arrangement;
    validate<Arrangement>(state, Arrangement);
    await this.knuContractService.createArrangement(issuer, Number(state.reward));
    await ctx.replyWithHTML(`Створено подію з сумою винагороди ${state.reward}KNU`, teacherKeyboard);
    await ctx.scene.enter(TEACHER_SCENE);
  }

  @Command('back')
  @Hears('Назад 🚪')
  async onBackCommand(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.enter(TEACHER_SCENE);
  }
}
