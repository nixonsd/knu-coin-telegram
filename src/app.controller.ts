import { Controller, Get, Inject } from '@nestjs/common';
import { API_VERSION } from './constants';

@Controller()
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
