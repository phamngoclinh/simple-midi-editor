import SongAggregate from '../../../domain/songAggregate/songAggregate';
import TrackEntity from '../../../domain/songAggregate/trackEntity';
import BaseUseCase from '../baseUseCase';
import generateId from '../common/generateId';

class InitializeSongUseCase extends BaseUseCase<void, SongAggregate> {
  handle() {
    return new Promise<SongAggregate>(resolve => {
      const tracks = new Array(8).fill(0).map((item, index) => {
        const order = index + 1;
        const track: TrackEntity = {
          id: generateId('track'),
          label: `Track ${order}`,
          order: order,
          instrument: `Instrument ${order}`,
          notes: [],
        };
        return track;
      });
      const result: SongAggregate = {
        id: generateId('song'),
        name: '',
        description: '',
        totalDuration: 100,
        tags: [],
        tracks: tracks,
        createdTimestamp: `${Date.now()}`,
        updatedTimestamp: `${Date.now()}`,
      };

      resolve(result);
    });
  }
}

export default InitializeSongUseCase;
