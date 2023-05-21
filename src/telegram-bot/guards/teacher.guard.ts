import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces';
import { KNUCoinContractService } from '@knu-coin-contract/knu-coin-contract.service';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private readonly knuCoinContractService: KNUCoinContractService) {}

  private readonly ADMIN_IDS = [];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isTeacher = await this.knuCoinContractService.isTeacher(from?.id as number);
    if (!isTeacher) {
      throw new TelegrafException('Ви не вчитель! 😡');
    }

    return true;
  }
}
