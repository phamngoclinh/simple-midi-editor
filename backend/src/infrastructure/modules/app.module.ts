import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SongModule } from './song.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SongModule,
  ],
})
export class AppModule { }
