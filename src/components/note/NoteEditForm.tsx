// src/components/note/NoteEditForm.tsx
import React, { useState, useEffect } from 'react';
import { Song } from '../../domain/entities/Song'; // Import Song để lấy tracks và totalDuration

// Định nghĩa dữ liệu Note tối thiểu để form xử lý
export interface NoteFormData {
  songId: string;
  trackId: string;
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
  const [formData, setFormData] = useState<NoteFormData>(
    getDefaultNoteFormData(currentSong, initialNote)
  );

  console.log('---fomdata', formData)

  const { tracks, totalDuration } = currentSong;

  // Cập nhật state nếu initialNote thay đổi
  useEffect(() => {
    setFormData(getDefaultNoteFormData(currentSong, initialNote));
  }, [currentSong, initialNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Xử lý trường Time: đảm bảo là số và nằm trong giới hạn
    if (name === 'time') {
      const timeValue = parseFloat(value);
      if (timeValue >= 0 && timeValue <= totalDuration) {
        setFormData(prev => ({ ...prev, [name]: timeValue }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Tiêu đề Note không được để trống.");
      return;
    }
    if (formData.time < 0 || formData.time > totalDuration) {
        alert(`Thời gian không hợp lệ. Phải nằm trong khoảng 0 đến ${totalDuration}.`);
        return;
    }

    onSubmit(formData);
  };

  const submitButtonLabel = buttonLabel || (initialNote ? 'Lưu Note' : 'Tạo Note');

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* 1. Track Selection */}
      <label style={labelStyle}>Track:</label>
      <select
        name="trackId"
        value={formData.trackId}
        onChange={handleChange}
        style={inputStyle}
        required
      >
        {tracks.map(track => (
          // Đảm bảo id của track là string hoặc number
          <option key={track.id} value={track.id as string}>
            {track.label} (ID: {track.id})
          </option>
        ))}
      </select>

      {/* 2. Time Input */}
      <label style={labelStyle}>Time (0 đến {totalDuration}):</label>
      <input
        type="number"
        name="time"
        value={formData.time}
        onChange={handleChange}
        min="0"
        max={totalDuration}
        step="1"
        style={inputStyle}
        required
      />
      
      {/* 3. Title Input */}
      <label style={labelStyle}>Tiêu đề Note:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Tiêu đề gợi nhớ"
        required
      />
      
      {/* 4. Description Textarea */}
      <label style={labelStyle}>Mô tả Note:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        style={textareaStyle}
        placeholder="Ghi chú chi tiết cho Note này..."
      />

      {/* 5. Color Input */}
      <label style={labelStyle}>Màu sắc:</label>
      <input
        type="color"
        name="color"
        value={formData.color}
        onChange={handleChange}
        style={{ ...inputStyle, height: '40px' }}
      />

      {/* 6. Icon Input */}
      <label style={labelStyle}>Icon:</label>
      <input
        type="text"
        name="icon"
        value={formData.icon}
        onChange={handleChange}
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

// --- Định nghĩa Style Cơ bản ---
// (Sử dụng lại một số style từ SongForm và thêm mới)

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginTop: '5px',
  color: '#555',
  fontSize: '0.9em'
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  fontSize: '1em',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
};

const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    justifyContent: 'flex-end',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '1em',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
    ...submitButtonStyle,
    backgroundColor: '#6c757d',
};