import { Command, Ctx, Hears, Message, Next, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { MINT_WIZARD, TEACHER_SCENE } from '../constants';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TeacherGuard } from '../guards';
import { validate } from '@telegram-bot/utils';
import { KNUCoinContractService } from '@knu-coin-contract/knu-coin-contract.service';
import { IsInt, IsPositive } from 'class-validator';
import { TelegrafExceptionFilter } from '../filters';

class Mint {
  @IsInt()
  @IsPositive()
  public userId?: number;

  @IsPositive()
  public amount?: number;
}

const backKeyboard = Markup.keyboard([ 'Назад 🚪' ]).oneTime();

@Wizard(MINT_WIZARD)
@UseGuards(TeacherGuard)
@UseFilters(TelegrafExceptionFilter)
export class MintWizard {
  constructor(private readonly knuCoinContractService: KNUCoinContractService) {}

  @WizardStep(1)
  async readUserId(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть код поповнення балансу користувача, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async userIdHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Mint;
    state.userId = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }

  @WizardStep(3)
  async readAmount(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть суму поповнення, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(4)
  async amountHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Mint;
    state.amount = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }

  @WizardStep(5)
  async process(@Ctx() ctx: Scenes.WizardContext, @Sender('id') issuer: number) {
    const state = ctx.wizard.state as Mint;
    validate<Mint>(state, Mint);
    await this.knuCoinContractService.mint(issuer, Number(state.userId), Number(state.amount));
    await ctx.replyWithHTML(`Користувачу з ідентифіктором <b>${state.userId}</b> відправлено ${state.amount}<b>KNU</b>`);
    await ctx.scene.enter(TEACHER_SCENE);
  }

  @Command('back')
  @Hears('Назад 🚪')
  async onBackCommand(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.enter(TEACHER_SCENE);
  }
}
