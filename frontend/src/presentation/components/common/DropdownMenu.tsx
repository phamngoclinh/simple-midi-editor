'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement | string;
  isDestructive?: boolean;
  link?: string;
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
  align = 'right',
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
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={triggerLabel || 'Tùy chọn'}
        className="cursor-pointer"
      >
        {triggerIcon}
        {triggerLabel && <span style={{ marginLeft: '5px' }}>{triggerLabel}</span>}
      </button>

      {isOpen && (
        <div
          style={{ ...menuPositionStyle }}
          className="z-10 absolute top-full min-w-[175px] flex flex-col bg-background text-foreground border border-border rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100"
        >
          {items.map((item, index) => {
            const child = (
              <>
                {item.icon && (
                  <span style={{ marginRight: '8px' }} className="flex">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </>
            );
            const btnCls = `cursor-pointer hover:bg-muted flex items-center p-2 ${item.isDestructive ? 'text-red-500' : ''}`;
            if (item.link) {
              return (
                <Link className={btnCls} href={item.link} key={index}>
                  {child}
                </Link>
              );
            }
            return (
              <button
                className={btnCls}
                onClick={e => {
                  e.stopPropagation();
                  handleItemClick(item.onClick);
                }}
                key={index}
              >
                {child}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
