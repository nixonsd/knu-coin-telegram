import { plainToClass } from 'class-transformer';
import { IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';

import * as dotenv from 'dotenv';
dotenv.config();

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
}

export interface IAppConfig {
  port: number;
  listenHost?: string;
  version?: string;
  logLevel: string;
  telegramApiKey: string;
  web3ProviderUri: string;
  contractAddress: string;
  signerPrivateKey: string;
}

export class AppConfigValidator implements IAppConfig {
  @IsNumber()
  readonly port!: number;

  @IsString()
  @IsOptional()
  readonly listenHost?: string;

  @IsString()
  @IsOptional()
  readonly version?: string;

  @IsEnum(LogLevel)
  readonly logLevel!: LogLevel;

  @IsString()
  readonly telegramApiKey!: string;

  @IsUrl()
  readonly web3ProviderUri!: string;

  @IsEthereumAddress()
  readonly contractAddress!: string;

  @IsString()
  @IsNotEmpty()
  readonly signerPrivateKey!: string;
}

export const getAppConfig = (): IAppConfig => {
  const config = {
    port: parseInt(`${process.env.API_PORT ?? 3000}`, 10) as number,
    listenHost: process.env.LISTEN_HOST as string,
    version: process.env.API_VERSION as string,
    logLevel: process.env.LOG_LEVEL || LogLevel.INFO,
    telegramApiKey: process.env.TELEGRAM_API_KEY as string,
    web3ProviderUri: process.env.WEB3_PROVIDER_URI as string,
    contractAddress: process.env.CONTRACT_ADDRESS as string,
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY as string,
  };

  return validate(config, AppConfigValidator);
};

export function validate(config: IAppConfig, ValidationClass: new() => AppConfigValidator): AppConfigValidator {
  const validatedConfig = plainToClass(
    ValidationClass,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
