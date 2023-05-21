import { Module } from '@nestjs/common';
import { KNUCoinContractService } from './knu-coin-contract.service';

@Module({
  providers: [ KNUCoinContractService ],
  exports: [ KNUCoinContractService ],
})
export class KNUCoinContractModule {}
