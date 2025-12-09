import { LocalStorageSongRepository } from './infrastructure/storage/LocalStorageSongRepository';
import { LocalStorageNoteRepository } from './infrastructure/storage/LocalStorageNoteRepository';
import { ListAllSongs } from './application/song/ListAllSong';
import { CreateNewSong } from './application/song/CreateNewSong';
import { EditSong } from './application/song/EditSong';
import { DeleteSong } from './application/song/DeleteSong';
import { LoadSongById } from './application/song/LoadSongById';
import { AddNoteToSong } from './application/note/AddNoteToSong';

export const songRepo = new LocalStorageSongRepository();
export const noteRepo = new LocalStorageNoteRepository();
export const listAllSongsUseCase = new ListAllSongs(songRepo);
export const createNewSongUseCase = new CreateNewSong(songRepo);
export const editSongUseCase = new EditSong(songRepo);
export const deleteSongUseCase = new DeleteSong(songRepo);
export const loadSongByIdUseCase = new LoadSongById(songRepo);
export const addNoteToSongUseCase = new AddNoteToSong(songRepo, noteRepo);