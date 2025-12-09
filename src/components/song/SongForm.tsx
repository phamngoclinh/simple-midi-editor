// src/components/song/SongForm.tsx
import React, { useState, useEffect } from 'react';
import { Song } from '../../domain/entities/Song'; // Import Entity Song
import { v4 as uuidv4 } from 'uuid';
import { Track } from '../../domain/entities/Track';


// Định nghĩa dữ liệu form đầu vào
interface SongFormData {
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
    name: song?.name || '',
    description: song?.description || '',
    totalDuration: song?.totalDuration || 100,
    tracks: tracks,
    tags: [],
  }
};

const SongForm: React.FC<SongFormProps> = ({ 
  onSubmit, 
  initialSong, 
  buttonLabel 
}) => {
  const isEditing = !!initialSong;
  
  // Quản lý trạng thái form bằng một object
  const [formData, setFormData] = useState<SongFormData>(getDefaultFormData(initialSong));
  
  // Cập nhật state khi initialSong thay đổi (ví dụ: khi mở form edit mới)
  useEffect(() => {
    setFormData(getDefaultFormData(initialSong));
  }, [initialSong]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const mapping: Record<string, (value: any) => any> = {
      totalDuration: (value: any) => parseInt(value) || 0,
      // trackLabels: (value: any) => value.trim().split(',') || [],
      default: (value: any) => value,
    }
    setFormData(prev => ({
      ...prev,
      [name]: (mapping[name] || mapping['default'])(value)
    }));
  };

  const handleTrackChange = (index: number, field: 'label' | 'order', value: string | number) => {
    const newTracks = [...formData.tracks];
    
    // Đảm bảo value là number nếu là 'order'
    const finalValue = (field === 'order' ? parseInt(value as string) || 0 : value) as string | number;
    
    // Cập nhật track tại index
    newTracks[index] = {
      ...newTracks[index],
      [field]: finalValue,
    };

    // Sắp xếp lại track sau khi thay đổi order (đảm bảo hiển thị đúng)
    newTracks.sort((a, b) => a.order - b.order);

    setFormData(prev => ({
        ...prev,
        tracks: newTracks
    }));
  };

  // // --- Logic Thêm Track Mới ---
  // const handleAddTrack = () => {
  //   const newTrack: Track = {
  //     // Dùng timestamp hoặc số ngẫu nhiên tạm thời làm id cho track mới
  //     id: uuidv4(), 
  //     label: `New Track ${formData.tracks.length + 1}`,
  //     order: formData.tracks.length + 1,
  //     instrument: 'New Instrument',
  //     notes: []
  //   };
  //   setFormData(prev => ({
  //     ...prev,
  //     tracks: [...prev.tracks, newTrack],
  //   }));
  // };

  // // --- Logic Xóa Track ---
  // const handleRemoveTrack = (idToRemove: string | number) => {
  //   setFormData(prev => ({
  //       ...prev,
  //       tracks: prev.tracks.filter(t => t.id !== idToRemove)
  //   }));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Tên bài hát không được để trống.");
      return;
    }

    // Gọi hàm onSubmit với dữ liệu đã được thu thập
    onSubmit(formData);

    // Nếu là chế độ Tạo mới, reset form
    if (!isEditing) {
      setFormData(getDefaultFormData());
    }
  };

  const submitButtonLabel = buttonLabel 
    ? buttonLabel 
    : isEditing ? 'Lưu thay đổi' : 'Tạo Bài Hát';

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Input: Tên Song */}
      <label style={labelStyle}>Tên Song:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Nhập tên bài hát"
      />
      
      {/* Textarea: Mô tả */}
      <label style={labelStyle}>Mô tả:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        style={textareaStyle}
        placeholder="Mô tả chi tiết bài hát..."
      />

      {/* Input: Total Duration */}
      <label style={labelStyle}>Total Duration:</label>
      <input
        type="number"
        name="totalDuration"
        value={formData.totalDuration}
        onChange={handleChange}
        min="1"
        max="300"
        style={inputStyle}
      />

      {/* Input: Track Labels */}
      <label style={labelStyle}>**Quản Lý Tracks**:</label>
      <div style={trackListStyle}>
        {formData.tracks.map((track, index) => (
          <div key={track.id || index} style={trackItemStyle}>
            {/* Input Label */}
            <input
              type="text"
              value={track.label}
              onChange={(e) => handleTrackChange(index, 'label', e.target.value)}
              placeholder="Track Label"
              style={trackInputStyle}
            />
            {/* Input Order */}
            <input
              type="number"
              value={track.order}
              onChange={(e) => handleTrackChange(index, 'order', e.target.value)}
              min="1"
              max={formData.tracks.length}
              style={trackOrderInputStyle}
            />
            {/* Nút Xóa
            <button 
                type="button" 
                onClick={() => handleRemoveTrack(track.id || index)} 
                style={removeButtonStyle}
                title="Xóa Track"
            >
                -
            </button> */}
          </div>
        ))}
        
        {/* Nút Thêm Track
        <button 
            type="button" 
            onClick={handleAddTrack} 
            style={addButtonFormStyle}
        >
            + Thêm Track Mới
        </button> */}
      </div>

      <button 
        type="submit" 
        style={buttonStyle}
        disabled={!formData.name.trim()}
      >
        {submitButtonLabel}
      </button>
    </form>
  );
};

export default SongForm;

// --- Định nghĩa Style Cơ bản ---

// --- Styles bổ sung cho Track Management ---
const trackListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px',
  border: '1px dashed #ddd',
  borderRadius: '4px',
};

const trackItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '5px',
  alignItems: 'center',
};

const trackInputStyle: React.CSSProperties = {
  padding: '6px',
  flexGrow: 1,
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const trackOrderInputStyle: React.CSSProperties = {
  ...trackInputStyle,
  flexGrow: 0,
  width: '50px',
  textAlign: 'center',
};

const addButtonFormStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '0.9em',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '5px',
};

const removeButtonStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '1em',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '15px',
  border: '1px solid #eee',
  borderRadius: '8px',
  backgroundColor: '#fff'
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
  width: '100%',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '1em',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};