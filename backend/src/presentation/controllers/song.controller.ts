/**
 * Presentation Layer - Notification Controller
 * Handles HTTP requests and delegates to use cases
 */

import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from '@nestjs/common';
import { NotesUseCase } from 'src/application/usecases/note.usecase';
import { SongsUseCase } from 'src/application/usecases/song.usecase';
import { TracksUseCase } from 'src/application/usecases/track.usecase';
import { TrackLabelRequiredException } from 'src/domain/exceptions/TrackLabelRequired.exception';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { CreateSongDto } from '../dtos/create-song.dto';
import { UpdateNoteDto } from '../dtos/update-note.dto';
import { UpdateSongDto } from '../dtos/update-song.dto';

@Controller()
export class SongController {
  private readonly logger = new Logger(SongController.name);

  constructor(
    private readonly songsUseCase: SongsUseCase,
    private readonly tracksUseCase: TracksUseCase,
    private readonly notesUseCase: NotesUseCase,
  ) { }

  //#region Song

  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsUseCase.create(CreateSongDto.toDomain(createSongDto));
  }

  @Get()
  findAll() {
    return this.songsUseCase.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsUseCase.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsUseCase.update({ ...updateSongDto, id });
  }

  @Delete(':id')
  @HttpCode(204) // Trả về 204 No Content khi xóa thành công
  remove(@Param('id') id: string) {
    return this.songsUseCase.remove(id);
  }

  //#endregion

  //#region Track

  @Put(':songId/tracks/:trackId/label')
  async updateTrackLabel(
    @Param('trackId') trackId: string,
    @Body('label') label: string, // Chỉ lấy trường 'label' từ Body
  ) {
    // Không cần dùng songId ở đây nếu trackId là unique
    if (!label) {
      throw new TrackLabelRequiredException();
    }
    return this.tracksUseCase.updateLabel(trackId, label);
  }

  //#endregion

  //#region Notes
  @Post(':songId/tracks/:trackId/notes')
  createNote(@Param('trackId') trackId: string, @Body() createNoteDto: CreateNoteDto) {
    return this.notesUseCase.create(trackId, createNoteDto);
  }

  @Post(':trackId/notes')
  createNoteOther(@Param('trackId') trackId: string, @Body() createNoteDto: CreateNoteDto) {
    return this.notesUseCase.create(trackId, createNoteDto);
  }

  @Get(':songId/notes')
  findAllNotesBySong(@Param('songId') songId: string) {
    // Dùng service để lấy Notes, không cần songId
    return this.notesUseCase.findAllBySong(songId);
  }

  // GET /songs/:songId/tracks/:trackId/notes
  // Lấy tất cả Notes của một Track
  @Get(':songId/tracks/:trackId/notes')
  findAllNotesByTrack(@Param('trackId') trackId: string) {
    // Dùng service để lấy Notes, không cần songId
    return this.notesUseCase.findAllByTrack(trackId);
  }

  // GET /notes/:noteId
  // Lấy chi tiết một Note (Dùng route độc lập để đơn giản)
  @Get('notes/:noteId')
  findOneNote(@Param('noteId') noteId: string) {
    return this.notesUseCase.findOne(noteId);
  }

  // PUT /notes/:noteId
  // Cập nhật một Note
  @Put('notes/:noteId')
  updateNote(@Param('noteId') noteId: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesUseCase.update(noteId, updateNoteDto);
  }

  // DELETE /notes/:noteId
  // Xóa một Note
  @Delete('notes/:noteId')
  @HttpCode(204)
  removeNote(@Param('noteId') noteId: string) {
    return this.notesUseCase.remove(noteId);
  }
  //#endregion
}
