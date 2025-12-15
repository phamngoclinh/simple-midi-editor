/**
 * Infrastructure Layer - Notification Message Repository Implementation
 * Implements the domain repository interface using TypeORM
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITrackRepository } from 'src/domain/repositories/track.repository';
import { Repository } from 'typeorm';
import { TrackEntity } from '../entities/track.entity';
import { TrackMapper } from '../mappers/track.mapper';
import { Track } from 'src/domain/entities/track.entity';

@Injectable()
export class TrackRepositoryImpl implements ITrackRepository {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly tracksRepository: Repository<TrackEntity>,
  ) { }

  createTrack(data: Track): Track {
    const entity = TrackMapper.toPersistence(data);
    const createdEntity = this.tracksRepository.create(entity);
    return TrackMapper.toDomain(createdEntity);
  }

  async findTrackById(id: string): Promise<Track | null> {
    const entity = await this.tracksRepository.findOneBy({ id });
    return entity ? TrackMapper.toDomain(entity) : null;
  }

  async saveTrack(data: Track): Promise<Track> {
    const entity = TrackMapper.toPersistence(data);
    const savedEntity = await this.tracksRepository.save(entity);
    return TrackMapper.toDomain(savedEntity);
  }

  async deleteTracks(ids: string[]): Promise<{ affected?: number | null }> {
    return this.tracksRepository.delete(ids);
  }
}
