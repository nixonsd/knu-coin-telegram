import { IAppConfig, getAppConfig } from '@shared/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { abi } from '@shared/abi';

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

    const provider = new ethers.JsonRpcProvider(providerUri);
    const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    this.contract = new ethers.Contract(contractAddress, abi, signer);
  }

  public async mint(issuer: number, userId: number, amount: number): Promise<void> {
    const decimals = await this.decimals();
    await this.contract.mint(
      issuer,
      userId,
      ethers.parseUnits(amount.toString(), decimals),
    );
  }

  public async createArrangement(issuer: number, reward: number): Promise<void> {
    const decimals = await this.decimals();
    await this.contract.createArrangement(
      issuer,
      ethers.parseUnits(reward.toString(), decimals),
    );
  }

  public async getArrangements(teacherId: number): Promise<number[]> {
    return this.contract.getArrangements(teacherId);
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
