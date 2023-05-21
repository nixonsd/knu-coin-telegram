import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces';
import { KnuContractService } from '@/knu-contract/knu-contract.service';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private readonly knuContractService: KnuContractService) {}

  private readonly ADMIN_IDS = [];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isTeacher = await this.knuContractService.isTeacher(from?.id as number);
    if (!isTeacher) {
      throw new TelegrafException('Ви не вчитель! 😡');
    }

    return true;
  }
}
