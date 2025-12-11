/**
 * Infrastructure Layer - Notification Message Repository Implementation
 * Implements the domain repository interface using TypeORM
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteEntity } from '../entities/note.entity';
import { INoteRepository } from 'src/domain/repositories/note.repository';
import { Note } from 'src/domain/entities/note.entity';
import { NoteMapper } from '../mappers/note.mapper';

@Injectable()
export class NoteRepositoryImpl implements INoteRepository {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly notesRepository: Repository<NoteEntity>,
  ) { }

  mergeNote(data: Note, update: Partial<Note>): Note {
    const entity = NoteMapper.toPersistence(data);
    const mergedEntity = this.notesRepository.merge(entity, update);
    return NoteMapper.toDomain(mergedEntity);
  }

  createNote(data: Note): Note {
    const entity = NoteMapper.toPersistence(data);
    const createdEntity = this.notesRepository.create(entity);
    return NoteMapper.toDomain(createdEntity);
  }

  async saveNote(message: Note): Promise<Note> {
    const entity = NoteMapper.toPersistence(message);
    const savedEntity = await this.notesRepository.save(entity);
    return NoteMapper.toDomain(savedEntity);
  }

  async findNoteById(id: string): Promise<Note | null> {
    const entity = await this.notesRepository.findOne({
      where: { id },
      relations: { track: true },
    });
    return entity ? NoteMapper.toDomain(entity) : null;
  }

  async findAllNote(): Promise<Note[]> {
    const entities = await this.notesRepository.find({
      relations: { track: true },
    });
    return entities.map((entity) => NoteMapper.toDomain(entity));
  }

  async findAllNoteBySongId(songId: string): Promise<Note[]> {
    const entities = await this.notesRepository.find({
      where: { track: { song: { id: songId } } },
      relations: { track: true },
    });
    return entities.map((entity) => NoteMapper.toDomain(entity));
  }

  async findAllNoteByTrackId(trackId: string): Promise<Note[]> {
    const entities = await this.notesRepository.find({
      where: { track: { id: trackId } },
      relations: { track: true },
    });
    return entities.map((entity) => NoteMapper.toDomain(entity));
  }

  deleteNote(id: string): Promise<{ affected?: number | null }> {
    return this.notesRepository.delete(id);
  }

  async findNoteByTimeNTrackId(
    time: number,
    trackId: string,
  ): Promise<Note | null> {
    return await this.notesRepository.findOneBy({
      time,
      track: { id: trackId },
    });
  }
}
