import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { isString } from 'class-validator';
import { Response } from 'express';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  async create(@Body() body: { text: string }, @Res() res: Response) {
    if (!body.text || !isString(body.text)) {
      throw new BadRequestException('text is required and must be a string');
    }
    const voice = await this.apiService.createAudio(body.text);
    res.set(voice.headers).send(Buffer.from(voice.stream.buffer));
  }
}
