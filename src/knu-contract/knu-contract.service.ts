import { IAppConfig, getAppConfig } from '@shared/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { abi } from '@shared/abi';
import { TelegrafException } from 'nestjs-telegraf';

type Arrangement = {
  name: string;
  reward: number;
};

@Injectable()
export class KnuContractService {
  private contract: ethers.Contract;
  private decimals_?: number;

  constructor(
    private readonly configService: ConfigService<IAppConfig>,
  ) {
    const appConfig = getAppConfig();
    this.configService = new ConfigService<IAppConfig>(appConfig);

    const providerUri = this.configService.get<string>('web3ProviderUri') as string;
    const contractAddress = this.configService.get<string>('contractAddress') as string;
    const signerPrivateAddress = this.configService.get<string>('signerPrivateKey') as string;

    const provider = new ethers.JsonRpcProvider(providerUri);
    const signer = new ethers.Wallet(signerPrivateAddress, provider);
    this.contract = new ethers.Contract(contractAddress, abi, signer);
  }

  public async mint(issuer: number, userId: number, amount: number): Promise<void> {
    const decimals = await this.decimals();
    await this.contract.mint(issuer, userId, ethers.parseUnits(amount.toString(), decimals));
  }

  public async createArrangement(issuer: number, name: string, reward: number): Promise<void> {
    const decimals = await this.decimals();
    const totalArrangements = await this.getTotalArrangements(issuer);
    if (totalArrangements < 4) {
      await this.contract.createArrangement(issuer, ethers.parseUnits(reward.toString(), decimals), ethers.encodeBytes32String(name));
    } else {
      throw new TelegrafException('Ви вже створили максимальну кількість подій! Видаліть, або завершіть попередні, щоб продовжити');
    }
  }

  public async removeArrangement(issuer: number, arrangementId: number): Promise<void> {
    const isIssuerOwner = await this.isOwner(issuer, arrangementId);
    if (isIssuerOwner) {
      await this.contract.removeArrangement(issuer, arrangementId);
    } else {
      throw new TelegrafException('Ви не власник цієї події!');
    }
  }

  public async finishArrangement(issuer: number, arrangementId: number): Promise<void> {
    const isIssuerOwner = await this.isOwner(issuer, arrangementId);
    if (isIssuerOwner) {
      await this.contract.finishArrangement(issuer, arrangementId);
    } else {
      throw new TelegrafException('Ви не власник цієї події!');
    }
  }

  public async getArrangementData(arrangementId: number): Promise<Arrangement> {
    const decimals = await this.decimals();
    const [ name, reward ] = await this.contract.getArrangementData(arrangementId);

    return {
      name: ethers.decodeBytes32String(name),
      reward: Number(ethers.formatUnits(reward, decimals)),
    };
  }

  public async addMember(issuer: number, memberId: number, arrangementId: number) {
    const isMember = await this.contract.isMember(arrangementId, memberId);
    if (isMember) {
      throw new TelegrafException('Ви вже є учасником цієї події!');
    }
    const arrangementExists = await this.arrangementExists(arrangementId);
    if (arrangementExists) {
      await this.contract.addMember(issuer, memberId, arrangementId);
    } else {
      throw new TelegrafException('Такої події не існує!');
    }
  }

  public async getArrangements(teacherId: number): Promise<number[]> {
    return this.contract.getArrangements(teacherId);
  }

  public async getTotalArrangements(teacherId: number): Promise<number> {
    return this.contract.getTotalArrangements(teacherId);
  }

  public async isOwner(teacherId: number, arrangementId: number): Promise<boolean> {
    return this.contract.isOwner(teacherId, arrangementId);
  }

  public async arrangementExists(arrangementId: number): Promise<boolean> {
    return this.contract.arrangementExists(arrangementId);
  }

  public async isTeacher(userId: number): Promise<boolean> {
    return this.contract.isTeacher(userId);
  }

  private async decimals(): Promise<number> {
    if (!this.decimals_) {
      this.decimals_ = await this.contract.decimals();
    }

    return this.decimals_ as number;
  }

  public async balanceOf(userId: number): Promise<string> {
    const balance = await this.contract.balanceOf(userId);
    const decimals = await this.decimals();

    return ethers.formatUnits(balance, decimals);
  }
}
