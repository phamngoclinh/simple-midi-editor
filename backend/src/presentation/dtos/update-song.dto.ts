// Chỉ cần extends CreateSongDto và làm tất cả các trường là tùy chọn
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSongDto, TrackDto } from './create-song.dto';

export class UpdateTrackDto extends PartialType(TrackDto) {
  id: string;
}

export class UpdateSongDto extends PartialType(
  OmitType(CreateSongDto, ['tracks']),
) {
  id: string;
  tracks?: UpdateTrackDto[];
}
