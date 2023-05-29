import { UseFilters } from '@nestjs/common';
import { Command, Ctx, Hears, Message, Next, Sender, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { BOT_MAIN_KEYBOARD, PARTICIPATE_WIZARD } from '../constants';
import { TelegrafExceptionFilter } from '../filters';
import { IsInt } from 'class-validator';
import { validate } from '../utils';
import { KnuContractService } from '@knu-contract/knu-contract.service';

const backKeyboard = Markup.keyboard([ 'Назад 🚪' ]).oneTime();
const mainKeyboard = Markup.keyboard(BOT_MAIN_KEYBOARD);

class Participation {
  @IsInt()
  public arrangementId!: number;
}

@Wizard(PARTICIPATE_WIZARD)
@UseFilters(TelegrafExceptionFilter)
export class ParticipateWizard {
  constructor(private readonly knuContractService: KnuContractService) {}

  @WizardStep(1)
  async readName(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Введіть ідентифікатор події, або натисніть кнопку "Назад 🚪", щоб повернутися в меню вчителя', backKeyboard);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async nameHandler(@Ctx() ctx: Scenes.WizardContext, @Message('text') text: string, @Next() next: () => Promise<void>) {
    const state = ctx.wizard.state as Participation;
    state.arrangementId = Number(text);
    ctx.wizard.next();
    if (typeof ctx.wizard.step === 'function') {
      await ctx.wizard.step(ctx, next);
    }
  }

  @WizardStep(5)
  async process(@Ctx() ctx: Scenes.WizardContext, @Sender('id') issuer: number) {
    const state = ctx.wizard.state as Participation;
    validate<Participation>(state, Participation);
    const arrangement = await this.knuContractService.getArrangement(Number(state.arrangementId));
    await this.knuContractService.addMember(issuer, issuer, Number(state.arrangementId));
    await ctx.replyWithHTML(
      `Вас було додано до події під назвою ${arrangement.name} з ідентифікатором <b>${state.arrangementId}</b>. Винагорода за подію: ${arrangement.reward}<b>KNU</b>`,
      mainKeyboard,
    );
    await ctx.scene.leave();
  }

  @Command('back')
  @Hears('Назад 🚪')
  async onBackCommand(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.replyWithHTML('Ви повернулися в головне меню!', mainKeyboard);
    await ctx.scene.leave();
  }
}
