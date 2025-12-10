// src/components/note/NoteEditForm.tsx
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Song } from '../../domain/entities/Song'; // Import Song để lấy tracks và totalDuration
import { MUSIC_ICONS } from '../../utils/icons';
import { buttonGroupStyle, cancelButtonStyle, errorStyle, formStyle, inputStyle, labelStyle, submitButtonStyle, textareaStyle } from './NoteEditForm.styles';

// Định nghĩa dữ liệu Note tối thiểu để form xử lý
export interface NoteFormData {
  songId: string;
  trackId: string;
  track: number;
  time: number; 
  title: string;
  description: string;
  color: string;
  icon?: string;
}

// Props của Form: Cần toàn bộ Song để lấy Track List và Total Duration
interface NoteEditFormProps {
  /** Dữ liệu Song hiện tại để lấy Tracks và Total Duration. */
  currentSong: Song;
  /** Note khởi tạo (nếu đang Edit), hoặc null nếu đang Tạo mới. */
  initialNote: NoteFormData | null;
  /** Hàm được gọi khi form submit. */
  onSubmit: (data: NoteFormData) => void;
  /** Hàm đóng form/modal. */
  onCancel: () => void;
  /** Tiêu đề nút Submit. */
  buttonLabel?: string;
}

// Hàm khởi tạo dữ liệu mặc định cho Form
const getDefaultNoteFormData = (song: Song, initialNote: NoteFormData | null): NoteFormData => {
  return initialNote || {
    songId: song.id || '',
    trackId: song.tracks[0]?.id || '',
    track: 1,
    time: 0,
    title: '',
    description: '',
    color: '#007bff',
    icon: 'none'
  };
};

const NoteEditForm: React.FC<NoteEditFormProps> = ({ 
  currentSong, 
  initialNote, 
  onSubmit, 
  onCancel, 
  buttonLabel 
}) => {
  const { tracks, totalDuration } = currentSong;

  // 💥 Khởi tạo useForm
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormData>({
    defaultValues: getDefaultNoteFormData(currentSong, initialNote),
  });

  // Reset form khi initialNote hoặc currentSong thay đổi
  useEffect(() => {
    console.log('---currentSong, initialNote, reset--', currentSong, initialNote, reset)
    reset(getDefaultNoteFormData(currentSong, initialNote));
  }, [currentSong, initialNote, reset]);

  const handleRHFSubmit: SubmitHandler<NoteFormData> = (data) => {
    const processedData: NoteFormData = { ...data };

    processedData.track = currentSong.tracks.findIndex(x => x.id === processedData.trackId) + 1;
    
    onSubmit(processedData);
  };

  const submitButtonLabel = buttonLabel || (initialNote ? 'Lưu Note' : 'Tạo Note');

  return (
    <form onSubmit={handleSubmit(handleRHFSubmit)} style={formStyle}>
      {/* 1. Track Selection */}
      <label style={labelStyle}>Track:</label>
      <select
        {...register("trackId", { required: "Vui lòng chọn Track" })}
        style={inputStyle}
      >
        {tracks.map(track => (
          <option key={track.id} value={track.id as string}>
            {track.label} (ID: {track.id})
          </option>
        ))}
      </select>
      {errors.trackId && <p style={errorStyle}>{errors.trackId.message}</p>}

      <label style={labelStyle}>Time (0 đến {totalDuration}):</label>
      <input
        type="number"
        // 💥 Sử dụng register với Validation
        {...register("time", {
          required: "Thời gian là bắt buộc",
          valueAsNumber: true,
          min: { value: 0, message: "Thời gian phải >= 0" },
          max: { value: totalDuration, message: `Thời gian phải <= ${totalDuration}` }
        })}
        style={inputStyle}
      />
      {errors.time && <p style={errorStyle}>{errors.time.message}</p>}
      
      
      {/* 3. Title Input */}
      <label style={labelStyle}>Tiêu đề Note:</label>
      <input
        type="text"
        // 💥 Sử dụng register
        {...register("title", { required: "Tiêu đề là bắt buộc" })}
        style={inputStyle}
        placeholder="Tiêu đề gợi nhớ"
      />
      {errors.title && <p style={errorStyle}>{errors.title.message}</p>}

      
      {/* 4. Description Textarea */}
      <label style={labelStyle}>Mô tả Note:</label>
      <textarea
        rows={3}
        // 💥 Sử dụng register
        {...register("description")}
        style={textareaStyle}
        placeholder="Ghi chú chi tiết cho Note này..."
      />

      {/* 5. Color Input */}
      <label style={labelStyle}>Màu sắc:</label>
      <input
        type="color"
        // 💥 Sử dụng register
        {...register("color")}
        style={{ ...inputStyle, height: '40px' }}
      />

      {/* 6. Icon Input */}
      <label style={labelStyle}>Icon:</label>
      <select
        {...register("icon")}
        style={inputStyle}
      >
        {MUSIC_ICONS.map(icon => (
          <option 
            key={icon.key} 
            value={icon.key} 
            // Có thể hiển thị symbol trong option nếu trình duyệt hỗ trợ tốt
          >
            {icon.symbol} {icon.description}
          </option>
        ))}
      </select>
      
      {/* Action Buttons */}
      <div style={buttonGroupStyle}>
        <button type="submit" style={submitButtonStyle}>
          {submitButtonLabel}
        </button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>
          Hủy
        </button>
      </div>
    </form>
  );
};

export default NoteEditForm;
