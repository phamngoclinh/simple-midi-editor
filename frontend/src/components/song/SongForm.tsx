// src/components/song/SongForm.tsx
import React, { useEffect } from 'react';
import { Song } from '../../domain/entities/Song'; // Import Entity Song
import { Track } from '../../domain/entities/Track';
import { errorStyle, formStyle, inputStyle, labelStyle, textareaStyle, trackInputStyle, trackItemStyle, trackListStyle } from './SongForm.styles';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { buttonGroupStyle, cancelButtonStyle, submitButtonStyle } from '../note/NoteEditForm.styles';
import TagsInput from '../common/TagsInput';


// Định nghĩa dữ liệu form đầu vào
interface SongFormData {
  id: string | undefined;
  name: string;
  description: string;
  totalDuration: number;
  tracks: Track[]; // Chuỗi các nhãn Track, ngăn cách bằng dấu phẩy
  tags: string[];
}

interface SongFormProps {
  /** Dữ liệu Song khởi tạo (nếu đang ở chế độ Edit/Tạo mới). */
  initialSong?: Song; 
  /** Hàm được gọi khi form được gửi. */
  onSubmit: (data: SongFormData) => void;
  onCancel?: () => void;
  /** Tiêu đề của nút submit. */
  buttonLabel?: string;
}

const getDefaultFormData = (song?: Song): SongFormData => {
  let tracks: Track[] = [];
  
  if (song && song.tracks.length > 0) {
    // Nếu có Song, lấy dữ liệu Track hiện có, đảm bảo có order
    tracks = song.tracks.map((t, index) => ({
      id: t.id,
      label: t.label,
      order: t.order ?? (index + 1), // Đảm bảo có order
      instrument: t.instrument,
      songId: t.songId,
      notes: t.notes
    })).sort((a, b) => a.order - b.order); // Sắp xếp theo order
  } else {
    // Nếu là tạo mới, cung cấp track mặc định
    tracks = [
      { id: '1', label: 'Track 1', order: 1, instrument: 'Instrument 1', notes: [] },
      { id: '2', label: 'Track 2', order: 2, instrument: 'Instrument 2', notes: [] },
      { id: '3', label: 'Track 3', order: 3, instrument: 'Instrument 3', notes: [] },
      { id: '4', label: 'Track 4', order: 4, instrument: 'Instrument 4', notes: [] },
      { id: '5', label: 'Track 5', order: 5, instrument: 'Instrument 5', notes: [] },
      { id: '6', label: 'Track 6', order: 6, instrument: 'Instrument 6', notes: [] },
      { id: '7', label: 'Track 7', order: 7, instrument: 'Instrument 7', notes: [] },
      { id: '8', label: 'Track 8', order: 8, instrument: 'Instrument 8', notes: [] },
    ];
  }

  return {
    id: song?.id || undefined,
    name: song?.name || '',
    description: song?.description || '',
    totalDuration: song?.totalDuration || 100,
    tags: song?.tags || [],
    tracks: tracks,
  }
};

const SongForm: React.FC<SongFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialSong, 
  buttonLabel 
}) => {
  // 💥 Khởi tạo useForm
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SongFormData>({
    // Thiết lập giá trị mặc định/khởi tạo
    defaultValues: getDefaultFormData(initialSong),
  });

  const { fields: trackFields } = useFieldArray({
    control,
    name: 'tracks'
  });

  // Reset form khi initialSong thay đổi (khi chuyển từ tạo mới sang chỉnh sửa)
  useEffect(() => {
    reset(getDefaultFormData(initialSong));
  }, [initialSong, reset]);

  // Hàm được gọi khi form submit hợp lệ
  const handleRHFSubmit: SubmitHandler<SongFormData> = (data) => {
    // 1. Xử lý Tags (Chuỗi -> Mảng)
    const processedTags = data.tags.filter(tag => tag.length > 0);

    // 2. Xử lý Tracks (Sắp xếp theo order một lần nữa trước khi gửi)
    const processedTracks = data.tracks.sort((a, b) => a.order - b.order);
    
    // 3. Chuẩn bị dữ liệu cuối cùng
    const finalData = {
        ...data,
        tags: processedTags, // Thay thế chuỗi tags bằng mảng đã xử lý
        tracks: processedTracks,
        // Đảm bảo các trường number được parse chính xác (sử dụng valueAsNumber trong register)
    };

    onSubmit(finalData as any);
  };

  const submitButtonLabel = buttonLabel || (initialSong ? 'Lưu Thay Đổi Song' : 'Tạo Song');

  return (
    <form onSubmit={handleSubmit(handleRHFSubmit)} style={formStyle}>
      {/* Input: Tên Song */}
      <label style={labelStyle}>Tên Song:</label>
      <input
        type="text"
        {...register("name", { required: "Tên bài hát là bắt buộc", maxLength: 100 })}
        style={inputStyle}
        placeholder="Nhập tên bài hát"
      />
      {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
      
      {/* Textarea: Mô tả */}
      <label style={labelStyle}>Mô tả:</label>
      <textarea
        {...register("description", { maxLength: 500 })}
        rows={3}
        style={textareaStyle}
        placeholder="Mô tả chi tiết bài hát..."
      />
      {errors.description && <p style={errorStyle}>{errors.description.message}</p>}

      {/* Input: Total Duration */}
      <label style={labelStyle}>Total Duration:</label>
      <input
        type="number"
        {...register("totalDuration", { 
          required: "Thời lượng là bắt buộc", 
          min: { value: 1, message: "Thời lượng phải lớn hơn 0" },
          valueAsNumber: true, // RHF sẽ tự chuyển sang number nếu type là number
        })}
        min="1"
        max="300"
        style={inputStyle}
      />
      {errors.totalDuration && <p style={errorStyle}>{errors.totalDuration.message}</p>}

      <label style={labelStyle}>Tags:</label>
      <TagsInput
        name="tags"
        control={control}
        placeholder="rock, drums, simple"
        maxTags={10}
      />

      {/* Input: Track Labels */}
      <label style={labelStyle}>**Quản Lý Tracks**:</label>
      <div style={trackListStyle}>
        {trackFields.map((field, index) => (
          <div key={field.id} style={trackItemStyle}>
            {/* Input Label */}
            <input
              type="text"
              {...register(`tracks.${index}.label`, { required: "Nhãn Track là bắt buộc" })}
              placeholder="Track Label"
              style={trackInputStyle}
            />
          </div>
        ))}
        {errors.tracks?.message && <p style={errorStyle}>{errors.tracks.message}</p>}
      </div>

      <div style={buttonGroupStyle}>
        <button type="submit" style={submitButtonStyle}>
          {submitButtonLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default SongForm;
