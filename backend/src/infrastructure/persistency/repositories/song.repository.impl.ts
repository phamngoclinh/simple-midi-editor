/**
 * Infrastructure Layer - Notification Message Repository Implementation
 * Implements the domain repository interface using TypeORM
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongEntity } from '../entities/song.entity';
import { SongMapper } from '../mappers/song.mapper';
import { ISongRepository } from 'src/domain/repositories/song.repository';
import { Song } from 'src/domain/entities/song.entity';

@Injectable()
export class SongRepositoryImpl implements ISongRepository {
  constructor(
    @InjectRepository(SongEntity)
    private readonly songsRepository: Repository<SongEntity>,
  ) { }

  mergeSong(data: Song, update: Partial<Song>): Song {
    const entity = SongMapper.toPersistence(data);
    const mergedEntity = this.songsRepository.merge(entity, update);
    return SongMapper.toDomain(mergedEntity);
  }

  createSong(data: Song): Song {
    const entity = SongMapper.toPersistence(data);
    const createdEntity = this.songsRepository.create(entity);
    return SongMapper.toDomain(createdEntity);
  }

  async saveSong(data: Song): Promise<Song> {
    const entity = SongMapper.toPersistence(data);
    const savedEntity = await this.songsRepository.save(entity);
    return SongMapper.toDomain(savedEntity);
  }

  async findSongById(id: string): Promise<Song | null> {
    const entity = await this.songsRepository.findOne({
      where: { id },
      relations: { tracks: { notes: true } },
    });
    return entity ? SongMapper.toDomain(entity) : null;
  }

  async findAllSong(): Promise<Song[]> {
    const entities = await this.songsRepository.find({
      relations: { tracks: { notes: true } },
      order: { tracks: { order: 'ASC' } },
    });
    return entities.map((entity) => SongMapper.toDomain(entity));
  }

  deleteSong(id: string): Promise<{ affected?: number | null }> {
    return this.songsRepository.delete(id);
  }
}
