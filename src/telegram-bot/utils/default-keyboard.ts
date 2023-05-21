import { Markup } from 'telegraf';
import { Context } from '../interfaces';
import { BOT_MAIN_KEYBOARD } from '../constants';

export async function defaultKeyboard(ctx: Context, message: string) {
  await ctx.replyWithMarkdownV2(message, Markup.keyboard(BOT_MAIN_KEYBOARD));
}
