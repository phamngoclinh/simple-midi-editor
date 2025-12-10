// src/components/note/NoteEditForm.tsx
import React, { useEffect } from 'react';
import { Song } from '../../domain/entities/Song'; // Import Song để lấy tracks và totalDuration
import { buttonGroupStyle, cancelButtonStyle, errorStyle, formStyle, inputStyle, labelStyle, submitButtonStyle, textareaStyle } from './NoteEditForm.styles';
import { useForm, SubmitHandler } from 'react-hook-form';

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
    icon: ''
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
    reset(getDefaultNoteFormData(currentSong, initialNote));
  }, [currentSong, initialNote, reset]);

  const handleRHFSubmit: SubmitHandler<NoteFormData> = (data) => {
    // 💥 Lưu ý: Đảm bảo trackId được chuyển về đúng kiểu (number/string) nếu cần thiết
    // Hiện tại, RHF sẽ giữ nguyên giá trị từ <select> (thường là string)
    const processedData: NoteFormData = {
      ...data, 
    };

    processedData.track = currentSong.tracks.findIndex(x => x.id === processedData.trackId) + 1;
    
    onSubmit(processedData);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
    
  //   // Xử lý trường Time: đảm bảo là số và nằm trong giới hạn
  //   if (name === 'time') {
  //     const timeValue = parseFloat(value);
  //     if (timeValue >= 0 && timeValue <= totalDuration) {
  //       setFormData(prev => ({ ...prev, [name]: timeValue }));
  //     }
  //     return;
  //   }
    
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.title.trim()) {
  //     alert("Tiêu đề Note không được để trống.");
  //     return;
  //   }
  //   if (formData.time < 0 || formData.time > totalDuration) {
  //       alert(`Thời gian không hợp lệ. Phải nằm trong khoảng 0 đến ${totalDuration}.`);
  //       return;
  //   }

  //   formData.track = currentSong.tracks.findIndex(x => x.id === formData.trackId) + 1;

  //   onSubmit(formData);
  // };

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
      <input
        type="text"
        {...register("icon")}
        style={{ ...inputStyle }}
      />
      
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
