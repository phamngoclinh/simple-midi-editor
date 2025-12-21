import SongEntity from '../../domain/song/songEntity';
import SongAggregate from '../../domain/songAggregate/songAggregate';
import { Song as SongResponse } from '../services/types';

const SongMapper = {

  toDomain(response: SongResponse): SongEntity {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      totalDuration: response.totalDuration,
      tags: response.tags,
      createdTimestamp: response.createdTimestamp,
      updatedTimestamp: response.updatedTimestamp
    }
  },

  toSongAggrate(response: SongResponse): SongAggregate {
    const { tracks, ...song } = response;
    tracks.sort((a, b) => a.order - b.order);
    return {
      id: song.id,
      name: song.name,
      description: song.description,
      totalDuration: song.totalDuration,
      tags: song.tags,
      tracks: tracks.map(t => ({
        id: t.id,
        label: t.label,
        order: t.order,
        instrument: t.instrument,
        notes: t.notes.map(n => ({
          id: n.id,
          time: n.time,
          title: n.title,
          description: n.description,
          color: n.color,
          icon: n.icon,
        })),
      })),
      createdTimestamp: song.createdTimestamp,
      updatedTimestamp: song.updatedTimestamp,
    }
  }

}

export default SongMapper;