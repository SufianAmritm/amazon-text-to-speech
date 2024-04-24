import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-polly';

@Injectable()
export class PollyService {
  private readonly client: AWS.Polly;
  constructor() {
    this.client = new AWS.Polly({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  async createAudio(input: AWS.SynthesizeSpeechCommandInput) {
    const voice = await this.client.send(
      new AWS.SynthesizeSpeechCommand(input),
    );
    if (voice instanceof Error) {
      console.log(voice);
      throw new BadRequestException(voice.message);
    }
    return voice;
  }
}
