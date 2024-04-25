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

import { isString } from 'class-validator';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StreamResponseModel } from 'src/common/dtos/response';
@ApiTags('AWS')
@Controller('aws')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  @ApiOperation({ description: 'Send text to get file response' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
      },
    },
  })
  @Post()
  async create(@Body() body: { text: string }) {
    if (!body.text || !isString(body.text)) {
      throw new BadRequestException('text is required and must be a string');
    }
    const voice = await this.apiService.createAudio(body.text);
    return new StreamResponseModel(
      null,
      voice.contentType,
      Buffer.from(voice.stream),
    );
  }
}
