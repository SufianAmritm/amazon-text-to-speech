import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { exceptionFilters } from './common/web/filters/index.filter';
import { getSwaggerConfiguration } from './swagger';

async function bootstrap() {
  const expressApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
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
  const expressPort = configService.get<number>('PORT') || 3000;
  process.on('SIGINT', async () => {
    console.log(
      'Received SIGINT signal.Please wait until app is self closed. Closing the application...',
    );
    await expressApp.close();
    console.log('Application closed. Now you can safely eject.');
    process.exit(0);
  });

  await expressApp.listen(expressPort);
}
bootstrap();
