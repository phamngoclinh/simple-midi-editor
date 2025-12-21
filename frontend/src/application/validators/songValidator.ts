import { TOTAL_DURATION_MAXIMUM } from '../../domain/song/songConstant';

export const validateSongName = (name: string): string | null => {
  if (!name || typeof name !== 'string') {
    return 'Tên bài hát là bắt buộc';
  } else if (name.length < 2) {
    return 'Tên bài hát quá ngắn';
  } else if (name.length > 250) {
    return 'Tên bài hát quá dài';
  }
  return null;
};

export const validateSongTotalDuration = (totalDuration: number): string | null => {
  const [min, max] = [0, TOTAL_DURATION_MAXIMUM];
  if (totalDuration < min || totalDuration > max) {
    return `Tổng thời lượng chỉ có thể nằm trong khoảng ${min} đến ${max} giây.`;
  }
  return null;
};
