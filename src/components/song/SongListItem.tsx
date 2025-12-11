// src/components/song/SongListItem.tsx
import React from 'react';
import { Song } from '../../domain/entities/Song'; // Import Entity Song
import DropdownMenu, { DropdownItem } from '../common/DropdownMenu';
import { actionsStyle, infoStyle, itemContainerStyle, metadataStyle, titleStyle } from './SongListItem.styles';

// Định nghĩa Props cho component
interface SongListItemProps {
  /** Dữ liệu Song cần hiển thị. */
  song: Song;
  /** Hàm được gọi khi người dùng nhấn nút "Open" (Mở Editor). */
  onOpen: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Edit" (Mở Form chỉnh sửa). */
  onEdit: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Delete". */
  onDelete: (songId: string) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Edit Notes". */
  onEditNotes: (song: Song) => void;
  /** Hàm được gọi khi người dùng nhấn nút "Export". */
  onExport: (song: Song) => void;
}

const SongListItem: React.FC<SongListItemProps> = ({
  song,
  onOpen,
  onEdit,
  onDelete,
  onEditNotes,
  onExport
}) => {
  // Định dạng timestamp cho dễ đọc
  const formattedDate = song.updatedTimestamp
    ? new Date(song.updatedTimestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Chưa xác định';

  // Xử lý các sự kiện click
  const handleOpen = () => song.id && onOpen(song.id);
  const handleEdit = () => song.id && onEdit(song.id);
  const handleDelete = () => song.id && onDelete(song.id);
  const handleEditNotes = () => onEditNotes(song);
  const handleExportSong = () => onExport(song);

  const getDropdownItems = (song: Song): DropdownItem[] => [
    {
      label: "Mở Editor",
      onClick: handleOpen, // Hàm mở trang Editor
      icon: "▶️",
    },
    {
      label: "Chỉnh sửa Song",
      onClick: handleEdit, // Hàm mở modal Edit Song
      icon: "⚙️",
    },
    {
      label: "Quản lý Notes",
      onClick: handleEditNotes, // Hàm mở modal Note Management
      icon: "🎼",
    },
    // --- Phân cách ---
    {
      label: "Export (JSON)",
      onClick: handleExportSong, // Hàm export đã tạo
      icon: "⬇️",
    },
    // --- Hành động xóa ---
    {
      label: "Xóa Song",
      onClick: handleDelete, // Hàm bắt đầu Confirmation
      icon: "🗑️",
      isDestructive: true,
    },
  ];

  return (
    <div style={itemContainerStyle}>
      {/* Thông tin Song */}
      <div style={infoStyle}>
        <span style={titleStyle} onClick={handleOpen} title="Mở Editor">
          {song.name}
        </span>
        <span style={metadataStyle}>
          Cập nhật: {formattedDate}
        </span>
      </div>

      {/* Các Nút Thao tác */}
      <div style={actionsStyle}>
        <DropdownMenu
          items={getDropdownItems(song)}
          triggerIcon="⚙️"
          align="right"
        />
      </div>
    </div>
  );
};

export default SongListItem;
