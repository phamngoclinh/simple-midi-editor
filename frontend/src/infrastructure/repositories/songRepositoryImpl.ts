import { Id } from '../../domain/shared/types';
import SongEntity from '../../domain/song/songEntity';
import SongRepository from '../../domain/song/songRepository';
import SongMapper from '../mapper/songMapper';
import { deleteSong, fetchAllSongs, fetchSongDetails } from '../services/api';

export class SongRepositoryImpl implements SongRepository {

  save(song: SongEntity): Promise<SongEntity> {
    throw new Error('Method not implemented.');
  }

  async findById(songId: Id): Promise<SongEntity> {
    const song = await fetchSongDetails(songId);
    return SongMapper.toDomain(song);
  }

  async findAll(): Promise<SongEntity[]> {
    const response = await fetchAllSongs()
    return response.map(SongMapper.toDomain)
  }

  deleteById(songId: Id): Promise<boolean> {
    return deleteSong(songId);
  }

}