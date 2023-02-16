import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { API_VERSION } from './constants';
import { ResponseInterceptor } from './response-interceptor';

@Controller()
@UseInterceptors(new ResponseInterceptor())
export class AppController {
  constructor(@Inject(API_VERSION) private readonly appVersion: string) {}

  @Get('health')
  getStatus(): string {
    return 'OK';
  }

  @Get('version')
  getVersion(): string {
    return this.appVersion;
  }
}
