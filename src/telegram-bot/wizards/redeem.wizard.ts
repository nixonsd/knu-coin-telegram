import { UseFilters } from '@nestjs/common';
import { REDEEM_WIZARD, TEACHER_SCENE } from '../constants';
import { Command, Ctx, Hears, Message, Next, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { TelegrafExceptionFilter } from '../filters';
import { KnuContractService } from '@knu-contract/knu-contract.service';
import { Markup, Scenes } from 'telegraf';
import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { validate } from '../utils';

class Redeem {
  @IsNumber()
  @IsInt()
  @IsPositive()
  public userId?: number;

  @IsNumber()
  @IsPositive()
  public amount?: number;
}

const backKeyboard = Markup.keyboard([ 'Назад 🚪' ]).oneTime();

@Wizard(REDEEM_WIZARD)
@UseFilters(TelegrafExceptionFilter)
export class RedeemWizard {
  constructor(private readonly knuContractService: KnuContractService) {}

  @WizardStep(1)
  async readUserId(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть код списання балансу користувача, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async userIdHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Redeem;
    state.userId = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }


  @WizardStep(3)
  async readAmount(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть суму списання, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(4)
  async amountHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Redeem;
    state.amount = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }

  @WizardStep(5)
  async process(@Ctx() ctx: Scenes.WizardContext, @Sender('id') issuer: number) {
    const state = ctx.wizard.state as Redeem;
    validate<Redeem>(state, Redeem);
    await this.knuContractService.redeem(issuer, Number(state.userId), Number(state.amount));
    await ctx.replyWithHTML(`У користувача з ідентифіктором <b>${state.userId}</b> списано ${state.amount}<b>KNU</b>`);
    await ctx.scene.enter(TEACHER_SCENE);
  }

  @Command('back')
  @Hears('Назад 🚪')
  async onBackCommand(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.scene.enter(TEACHER_SCENE);
  }
}
