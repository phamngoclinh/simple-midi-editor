import React, { useState, useRef, useEffect } from 'react';

// Định nghĩa cấu trúc cho mỗi Item trong Menu
export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: string; // Ví dụ: "✏️", "🗑️", "⚙️"
  isDestructive?: boolean; // Nếu là hành động xóa
}

interface DropdownMenuProps {
  items: DropdownItem[];
  triggerIcon?: string; // Icon cho nút mở menu
  triggerLabel?: string;
  align?: 'left' | 'right'; // Vị trí menu
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  triggerIcon = '⋮',
  triggerLabel,
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click ngoài (Click Away) để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  // Tính toán vị trí menu (left hoặc right)
  const menuPositionStyle: React.CSSProperties =
    align === 'right' ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      {/* Nút Trigger (Mở menu) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={triggerButtonStyle}
        title={triggerLabel || "Tùy chọn"}
      >
        {triggerIcon}
        {triggerLabel && <span style={{ marginLeft: '5px' }}>{triggerLabel}</span>}
      </button>

      {/* Menu thả xuống */}
      {isOpen && (
        <div style={{ ...menuStyle, ...menuPositionStyle }}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.onClick)}
              style={{
                ...itemStyle,
                color: item.isDestructive ? '#dc3545' : '#333',
                // Thêm hover effect
                backgroundColor: item.isDestructive ? 'rgba(220, 53, 69, 0.1)' : '#f8f9fa',
              }}
            >
              {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

// --- Styles ---

const containerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
};

const triggerButtonStyle: React.CSSProperties = {
  backgroundColor: '#f1f3f5',
  color: '#333',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '8px 12px',
  fontSize: '1em',
  cursor: 'pointer',
  minWidth: '40px',
};

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  marginTop: '5px',
  backgroundColor: 'white',
  minWidth: '175px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  borderRadius: '4px',
  zIndex: 50, // Đảm bảo nằm trên các phần tử khác
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const itemStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '10px 15px',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.95em',
  width: '100%',
  transition: 'background-color 0.2s',
};