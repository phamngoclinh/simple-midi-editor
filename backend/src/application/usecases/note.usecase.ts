/**
 * Application Layer - Get Delivery Stats Use Case
 * Retrieves delivery statistics for a given time period
 */

import { Note } from 'src/domain/entities/note.entity';
import { NoteAlreadyExistException } from 'src/domain/exceptions/NoteAlreadyExist.exception';
import { NoteNotFoundException } from 'src/domain/exceptions/NoteNotFound.exception';
import { TrackNotFoundException } from 'src/domain/exceptions/TrackNotFound.exception';
import { INoteRepository } from 'src/domain/repositories/note.repository';
import { ITrackRepository } from 'src/domain/repositories/track.repository';

class CreateNoteDto {
  time: number;
  title?: string;
  description?: string;
  color: string;
  icon?: string;
}

class UpdateNoteDto {
  time?: number;
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
  trackId?: string;
}

export class NotesUseCase {
  constructor(
    private readonly notesRepository: INoteRepository,
    private readonly tracksRepository: ITrackRepository,
  ) { }

  async create(trackId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    const track = await this.tracksRepository.findTrackById(trackId);

    if (!track) {
      throw new TrackNotFoundException({ id: trackId });
    }

    const existingNote = await this.notesRepository.findNoteByTimeNTrackId(
      createNoteDto.time,
      trackId,
    );

    if (existingNote) {
      throw new NoteAlreadyExistException({ trackId, time: createNoteDto.time });
    }

    const newNote = this.notesRepository.createNote({
      ...createNoteDto,
      track: track,
    } as Note);

    return this.notesRepository.saveNote(newNote);
  }

  /**
   * Lấy chi tiết một Note.
   * @param noteId ID của Note
   * @returns Note Entity
   */
  async findOne(noteId: string): Promise<Note> {
    const note = await this.notesRepository.findNoteById(noteId);
    if (!note) {
      throw new NoteNotFoundException({ id: noteId });
    }
    return note;
  }

  /**
   * Lấy tất cả Notes của một Track.
   * @param trackId ID của Track
   * @returns Mảng Notes
   */
  async findAllByTrack(trackId: string): Promise<Note[]> {
    // TypeORM sẽ tự động tạo điều kiện JOIN WHERE track.id = trackId
    return this.notesRepository.findAllNoteByTrackId(trackId);
  }

  async findAllBySong(songId: string): Promise<Note[]> {
    return this.notesRepository.findAllNoteBySongId(songId);
  }

  /**
   * Cập nhật một Note.
   * @param noteId ID của Note
   * @param updateNoteDto DTO chứa dữ liệu cập nhật
   * @returns Note đã được cập nhật
   */
  async update(noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepository.findNoteById(noteId);

    if (!note) {
      throw new NoteNotFoundException({ id: noteId });
    }

    if (updateNoteDto.time !== undefined) {
      const existingNote = await this.notesRepository.findNoteByTimeNTrackId(
        updateNoteDto.time,
        note.track.id,
      );

      if (existingNote && existingNote.id !== note.id) {
        throw new NoteAlreadyExistException({
          trackId: note.track.id,
          time: updateNoteDto.time,
        });
      }

      if (updateNoteDto.trackId && updateNoteDto.trackId !== note.track.id) {
        const existingNoteInOtherTrack = await this.notesRepository.findNoteByTimeNTrackId(
          updateNoteDto.time,
          updateNoteDto.trackId,
        );

        if (existingNoteInOtherTrack) {
          throw new NoteAlreadyExistException({
            trackId: updateNoteDto.trackId,
            time: updateNoteDto.time,
          });
        }

        note.track.id = updateNoteDto.trackId;
      }
    }

    // Merge DTO vào Entity hiện có
    const updatedNote = this.notesRepository.mergeNote(note, updateNoteDto);

    return this.notesRepository.saveNote(updatedNote);
  }

  /**
   * Xóa một Note.
   * @param noteId ID của Note
   */
  async remove(noteId: string): Promise<void> {
    const result = await this.notesRepository.deleteNote(noteId);
    if (result.affected === 0) {
      throw new NoteNotFoundException({ id: noteId });
    }
  }
}
