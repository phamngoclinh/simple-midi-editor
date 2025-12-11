import { Module } from '@nestjs/common';
import { SongModule } from './song.module';

@Module({
  imports: [SongModule],
})
export class AppModule { }
