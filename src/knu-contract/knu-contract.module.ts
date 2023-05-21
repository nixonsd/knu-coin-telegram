import { Module } from '@nestjs/common';
import { KnuContractService } from './knu-contract.service';

@Module({
  providers: [ KnuContractService ],
  exports: [ KnuContractService ],
})
export class KnuContractModule {}
