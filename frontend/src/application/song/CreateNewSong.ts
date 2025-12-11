// src/application/song/CreateNewSong.ts

import { ISongRepository } from '../../domain/repositories/ISongRepository';
import { Song } from '../../domain/entities/Song';
import { Track } from '../../domain/entities/Track';

const DEFAULT_DURATION = 0;
const DEFAULT_TRACKS = [
  { id: '1', label: 'Track 1', order: 1, instrument: 'Instrument 1', notes: [] },
  { id: '2', label: 'Track 2', order: 2, instrument: 'Instrument 2', notes: [] },
  { id: '3', label: 'Track 3', order: 3, instrument: 'Instrument 3', notes: [] },
  { id: '4', label: 'Track 4', order: 4, instrument: 'Instrument 4', notes: [] },
  { id: '5', label: 'Track 5', order: 5, instrument: 'Instrument 5', notes: [] },
  { id: '6', label: 'Track 6', order: 6, instrument: 'Instrument 6', notes: [] },
  { id: '7', label: 'Track 7', order: 7, instrument: 'Instrument 7', notes: [] },
  { id: '8', label: 'Track 8', order: 8, instrument: 'Instrument 8', notes: [] },
]

export interface CreateSongData {
  name: string;
  description: string;
  totalDuration: number;
  tracks: Track[]; // Mảng labels
  tags: string[];
}

/**
 * Lớp Use Case: Tạo một bài hát mới với các giá trị mặc định.
 */
export class CreateNewSong {
  private songRepository: ISongRepository;

  /**
   * Dependency Injection: Nhận ISongRepository.
   * Lớp này không biết Repository được triển khai bằng LocalStorage hay Database.
   */
  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }

  /**
   * Thực thi Use Case.
   * @param name Tên ban đầu của bài hát.
   * @returns Promise trả về thực thể Song đã được tạo và lưu.
   */
  async execute(data: CreateSongData): Promise<Song> {
    return this.songRepository.create({
      name: data.name,
      description: data.description || '',
      totalDuration: data.totalDuration || DEFAULT_DURATION,
      tags: data.tags || [],
      tracks: data.tracks || DEFAULT_TRACKS,
    });
  }
}