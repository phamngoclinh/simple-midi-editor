import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement | string;
  isDestructive?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  triggerIcon?: React.ReactElement | string;
  triggerLabel?: string;
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  triggerIcon = '⋮',
  triggerLabel,
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setIsOpen(false);
  };

  const menuPositionStyle: React.CSSProperties =
    align === 'right' ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={triggerLabel || "Tùy chọn"}
      >
        {triggerIcon}
        {triggerLabel && <span style={{ marginLeft: '5px' }}>{triggerLabel}</span>}
      </button>

      {isOpen && (
        <div style={{ ...menuStyle, ...menuPositionStyle }}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.onClick)}
              style={{
                ...itemStyle,
                color: item.isDestructive ? 'red' : '#dbdbdb',
                backgroundColor: '#151617',
              }}
            >
              {item.icon && <span style={{ marginRight: '8px' }} className='flex'>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

const containerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
};

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  marginTop: '5px',
  backgroundColor: 'white',
  minWidth: '175px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  borderRadius: '4px',
  zIndex: 50,
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