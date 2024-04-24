import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { PollyService } from './aws/aws-polly';

@Module({
  controllers: [ApiController],
  providers: [ApiService,PollyService],
})
export class ApiModule {}
