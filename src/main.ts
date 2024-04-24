import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { exceptionFilters } from './common/web/filters/index.filter';
import { getSwaggerConfiguration } from './swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const expressApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const fastifyApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService: ConfigService = expressApp.get(ConfigService);
  expressApp.enableCors();
  expressApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  expressApp.useGlobalFilters(...exceptionFilters);
  expressApp.useGlobalInterceptors(new ResponseInterceptor());
  await getSwaggerConfiguration(expressApp);
  const expressPort = configService.get<number>('EXPRESS_PORT') || 3000;
  const fastifyPort = configService.get<number>('FASTIFY_PORT') || 3001;
  process.on('SIGINT', async () => {
    console.log(
      'Received SIGINT signal.Please wait until app is self closed. Closing the application...',
    );
    await expressApp.close();
    console.log('Application closed. Now you can safely eject.');
    process.exit(0);
  });

  await expressApp.listen(expressPort);
  fastifyApp.enableCors();
  fastifyApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  fastifyApp.useGlobalFilters(...exceptionFilters);
  fastifyApp.useGlobalInterceptors(new ResponseInterceptor());
  await getSwaggerConfiguration(fastifyApp);
  await fastifyApp.listen(fastifyPort, '0.0.0.0');
}
bootstrap();
