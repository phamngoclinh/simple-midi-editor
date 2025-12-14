import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track';
import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { createSong, deleteSong, fetchAllSongs, fetchSongDetails, updateSong, updateTrackLabel } from '../services/api';
import { SongMapper, TrackMapper } from '../mapper/mapper';

export class BackendSongRepository implements ISongRepository {
  async create(song: Song): Promise<Song> {
    const response = await createSong({
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration,
      tags: song.tags,
      tracks: song.tracks.map(track => ({
        label: track.label,
        order: track.order,
        instrument: track.instrument,
        notes: track.notes
      }))
    });

    return SongMapper.toDomain(response);
  }

  async update(song: Partial<Song> & Required<Pick<Song, 'id'>>): Promise<Song> {
    const response = await updateSong({
      id: song.id,
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration,
      tags: song.tags,
      tracks: song.tracks?.map(track => ({
        id: track.id as string,
        label: track.label,
        order: track.order,
        instrument: track.instrument,
      }))
    });
    return SongMapper.toDomain(response);
  }

  async findById(id: string): Promise<Song | null> {
    const song = await fetchSongDetails(id);
    return SongMapper.toDomain(song);
  }

  async findAll(): Promise<Song[]> {
    const response = await fetchAllSongs()
    return response.map(song => SongMapper.toDomain(song))
  }

  async deleteById(id: string): Promise<void> {
    await deleteSong(id);
  }

  async updateTrackLabel(songId: string, trackId: string, label: string): Promise<Track> {
    const response = await updateTrackLabel(songId, trackId, label);
    return TrackMapper.toDomain(response);
  }
}