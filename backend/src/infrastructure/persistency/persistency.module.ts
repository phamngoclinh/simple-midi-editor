import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './database/database.config';
import { NoteEntity } from './entities/note.entity';
import { SongEntity } from './entities/song.entity';
import { TrackEntity } from './entities/track.entity';
import { persistencyProviders } from './persistency.providers';

@Module({
  imports: [
    DatabaseConfigModule,
    TypeOrmModule.forFeature([SongEntity, TrackEntity, NoteEntity]),
  ],
  providers: [...persistencyProviders],
  exports: [...persistencyProviders],
})
export class PersistencyModule { }
