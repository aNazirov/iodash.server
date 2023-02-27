import { PrismaService } from '@libs/prisma';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from 'config/config.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<AppConfig>>(ConfigService);
  const MODE = configService.get<string>('mode');

  const whitelist = [
    'http://159.223.157.138:3000',
    'http://iodash.anazirov.com',
  ];

  if (MODE === 'DEV') {
    whitelist.push('http://localhost:3000', 'http://localhost:3001');
  }

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: '*',
    methods: '*',
    credentials: true,
  });

  app.enableShutdownHooks();

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: MODE === 'DEV',
    }),
  );

  const PORT = configService.get<string>('port');

  await app.listen(PORT, '0.0.0.0', async () => {
    new Logger('NestApplication').log(
      [`🚀 Server ready on ${MODE} mode at: ${await app.getUrl()}`].join('\n'),
    );
  });
}
bootstrap();
