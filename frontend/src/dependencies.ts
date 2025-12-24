import CreateNoteUseCase from './application/usecases/note/createNoteUseCase';
import DeleteNoteUseCase from './application/usecases/note/deleteNoteUseCase';
import UpdateNoteUseCase from './application/usecases/note/updateNoteUseCase';
import CreateSongUseCase from './application/usecases/songAggregate/createSongUseCase';
import DeleteSongUseCase from './application/usecases/songAggregate/deleteSongUseCase';
import ExportSongUseCase from './application/usecases/songAggregate/exportSongUseCase';
import ImportSongUseCase from './application/usecases/songAggregate/importSongUseCase';
import InitializeSongUseCase from './application/usecases/songAggregate/initializeSongUseCase';
import ListAllSongsUseCase from './application/usecases/songAggregate/listAllSongUseCase';
import LoadSongByIdUseCase from './application/usecases/songAggregate/loadSongByIdUseCase';
import UpdateSongUseCase from './application/usecases/songAggregate/updateSongUseCase';
import { NoteRepositoryImpl } from './infrastructure/repositories/noteRepositoryImpl';
import { SongAggregateRepositoryImpl } from './infrastructure/repositories/songAggregateRepositoryImpl';
import { SongRepositoryImpl } from './infrastructure/repositories/songRepositoryImpl';
import { TrackRepositoryImpl } from './infrastructure/repositories/trackRepositoryImpl';

export const songRepo = new SongRepositoryImpl();
export const noteRepo = new NoteRepositoryImpl();
export const trackRepo = new TrackRepositoryImpl();
export const songAggregateRepo = new SongAggregateRepositoryImpl();

export const createSongUseCase = new CreateSongUseCase(songAggregateRepo);
export const updateSongUseCase = new UpdateSongUseCase(songAggregateRepo);
export const deleteSongUseCase = new DeleteSongUseCase(songAggregateRepo);
export const listAllSongsUseCase = new ListAllSongsUseCase(songAggregateRepo);
export const loadSongByIdUseCase = new LoadSongByIdUseCase(songAggregateRepo);
export const importSongUseCase = new ImportSongUseCase(songAggregateRepo);
export const exportSongUseCase = new ExportSongUseCase(songAggregateRepo);
export const initializeSongUseCase = new InitializeSongUseCase();

export const createNoteUseCase = new CreateNoteUseCase(noteRepo);
export const deleteNoteUseCase = new DeleteNoteUseCase(noteRepo);
export const updateNoteUseCase = new UpdateNoteUseCase(noteRepo);
