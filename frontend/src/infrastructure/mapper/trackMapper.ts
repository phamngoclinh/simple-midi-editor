import TrackEntity from '../../domain/track/trackEntity';
import { Track as TrackResponse } from '../services/types';

const TrackMapper = {
  toDomain(response: TrackResponse): TrackEntity {
    return {
      id: response.id,
      label: response.label,
      order: response.order,
      instrument: response.instrument,
      songId: 'song-id-from-api-response',
    };
  },
};

export default TrackMapper;
