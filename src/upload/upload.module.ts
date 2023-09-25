import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ([{
        ttl: ConfigService.getOrThrow('UPLOAD_THROTTLE_TTL'),
        limit: ConfigService.getOrThrow('UPLOAD_THROTTLE_LIMIT'),
      }]),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }]
})
export class UploadModule {}
